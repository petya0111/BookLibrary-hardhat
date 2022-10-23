const hre = require("hardhat");
const run = async function () {
    // Another way to create a contract
    const bookLibraryFactory = await hre.ethers.getContractFactory("BookLibraryContract");
    const bookLibraryContract = await bookLibraryFactory.attach(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    const bookName1 = "Mastering Etherium";
    try {
        await bookLibraryContract.addNewBook(bookName1, 50);
        await bookLibraryContract.addNewBook(
            "Smart Contracts with Solidity",
            50
        );
    } catch (e) {
        console.log("Already added books");
    }
    const allBookIds = await bookLibraryContract.getAllBookIds();
    const firstBook = allBookIds[0];
    const secondBook = allBookIds[1];
    console.log(`All available books length: `, allBookIds.length);

    await bookLibraryContract.borrowBook(firstBook);
    const historyBook1 = await bookLibraryContract.getBookBorrowHistory(
        firstBook
    );
    const borrowersOfTheBook = historyBook1.toString().split(",");
    console.log(
        `Book ${firstBook} has been rented by the user:`,
        borrowersOfTheBook.length > 0
    );
    await bookLibraryContract.returnBook(firstBook);
    const bookDetail = await bookLibraryContract.getBookDetail(firstBook);
    console.log(
        `Checks the availability of the book. Book name: ${bookDetail[0]} copies ${bookDetail[1]}`
    );
};

run();
