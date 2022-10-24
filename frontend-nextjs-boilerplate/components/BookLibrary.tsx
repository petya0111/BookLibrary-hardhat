import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Web3Context } from "../pages/_app";
import { useContext, useState, useEffect } from "react";
import useBookLibraryContract from "../hooks/useBookLibraryContract";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

type BookContract = {
    contractAddress: string;
};

const BookLibrary = ({ contractAddress }: BookContract) => {
    const { state, dispatch } = useContext(Web3Context);

    const { account, library } = useWeb3React<Web3Provider>();
    const bookLibraryContract = useBookLibraryContract(contractAddress);
    const [name, setName] = useState<string | undefined>();
    const [copies, setCopies] = useState<number | undefined>();
    const [ownerIsLoggedIn, setOwnerIsLoggedIn] = useState<boolean>(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        checkIfOwnerContract();
        getAllBooks();
    }, []);

    const checkIfOwnerContract = async () => {
        const ownerOfContract = await bookLibraryContract.owner();
        setOwnerIsLoggedIn(account === ownerOfContract);
    };

    const getAllBooks = async () => {
        const bookIds = await bookLibraryContract.getAllBookIds();
        if (bookIds.length > 0 && books.length != bookIds.length) {
            let arr =[];
            for (let bookId of bookIds) {
                let detail = await bookLibraryContract.getBookDetail(bookId);
                // setBooks({ name: detail[0], copies: detail[1] })
                arr.push({ name: detail[0], copies: detail[1] });
            }
            setBooks(arr);
        }
    };

    const bookNameInput = (input) => {
        setName(input.target.value);
    };

    const bookCopiesInput = (input) => {
        setCopies(input.target.value);
    };

    const submitBook = async () => {
        dispatch({ type: "fetching" });
        const tx = await bookLibraryContract.addNewBook(name, copies);
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
        resetForm();
    };

    const resetForm = async () => {
        setName("");
        setCopies(0);
    };

    return (
        <div className="results-form">
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Copies</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    {row.copies}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {ownerIsLoggedIn && (
                <form>
                    <label>
                        Book name:
                        <input
                            disabled={state.fetching}
                            onChange={bookNameInput}
                            value={name}
                            type="text"
                            name="book_name"
                        />
                    </label>
                    <label>
                        Book copies:
                        <input
                            disabled={state.fetching}
                            onChange={bookCopiesInput}
                            value={copies}
                            type="number"
                            name="book_copies"
                        />
                    </label>
                </form>
            )}
            {ownerIsLoggedIn && (
                <div className="button-wrapper">
                    <button disabled={state.fetching} onClick={submitBook}>
                        Submit Results
                    </button>
                </div>
            )}
            <style jsx>{`
                .results-form {
                    display: flex;
                    flex-direction: column;
                }
                .leader-results {
                    margin-bottom: 20px;
                }

                .button-wrapper {
                    margin: 20px;
                }
            `}</style>
        </div>
    );
};

export default BookLibrary;
