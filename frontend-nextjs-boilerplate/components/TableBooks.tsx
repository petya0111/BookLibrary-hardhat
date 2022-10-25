import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Web3Context } from "../pages/_app";
import { useContext, useState, useEffect } from "react";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

const TableBooks = ({ books, bookLibraryContract,parentStateSetter }) => {
    const { state, dispatch } = useContext(Web3Context);

    const { account, library } = useWeb3React<Web3Provider>();

    useEffect(() => {
        getAllBooks();
    }, []);

    const getAllBooks = async () => {
        const bookIds = await bookLibraryContract.getAllBookIds();
        if (bookIds.length > 0) {
            let arr = [];
            for (let bookId of bookIds) {
                let detail = await bookLibraryContract.getBookDetail(bookId);
                const borrowHistoryUserIds =
                    await bookLibraryContract.getBookBorrowHistory(bookId);
                let bookBorrowed = false;
                if (!borrowHistoryUserIds.includes(account)) {
                    bookBorrowed = false;
                } else {
                    bookBorrowed = await bookLibraryContract.isBookBorrowed(
                        bookId
                    );
                }
                arr.push({
                    id: bookId,
                    name: detail[0],
                    copies: detail[1],
                    rented: bookBorrowed,
                });
            }
            console.log(arr);
            parentStateSetter(arr);
        }
    };
    const rentBook = async (id) => {
        dispatch({ type: "fetching" });
        const tx = await bookLibraryContract.borrowBook(id);
        dispatch({ type: "fetching", transactionHash: tx.hash });
        const transactionReceipt = await tx.wait();
        if (transactionReceipt.status === 1) {
            dispatch({
                type: "fetched",
                messageType: "success",
                message: "Successfully submitted state result",
            });
            getAllBooks();
        } else {
            dispatch({
                type: "fetched",
                messageType: "error",
                message: JSON.stringify(transactionReceipt),
            });
        }
        getAllBooks();
    };

    const returnBook = async (id) => {
        dispatch({ type: "fetching" });
        const tx = await bookLibraryContract.returnBook(id);
        dispatch({ type: "fetching", transactionHash: tx.hash });
        const transactionReceipt = await tx.wait();
        if (transactionReceipt.status === 1) {
            dispatch({
                type: "fetched",
                messageType: "success",
                message: "Successfully submitted state result",
            });
            getAllBooks();
        } else {
            dispatch({
                type: "fetched",
                messageType: "error",
                message: JSON.stringify(transactionReceipt),
            });
        }
        getAllBooks();
    };

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Copies</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {books.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.copies}</TableCell>
                            {row.rented ? (
                                <TableCell align="right">
                                    return
                                    <IconButton
                                        onClick={() => {
                                            returnBook(row.id);
                                        }}
                                    >
                                        <KeyboardReturnIcon />
                                    </IconButton>
                                </TableCell>
                            ) : (
                                <TableCell align="right">
                                    rent
                                    <IconButton
                                        onClick={() => {
                                            rentBook(row.id);
                                        }}
                                    >
                                        <LibraryBooksIcon />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableBooks;
