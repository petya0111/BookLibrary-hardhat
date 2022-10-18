const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BookLibrary", function () {
    let dummyName = "Lorem Ipsum";
    let bookCopies = 50;
    let bookLibrary;
    before(async () => {
        let  bookLibraryFactory = await ethers.getContractFactory("Library");
        bookLibrary = await bookLibraryFactory.deploy();
        const [owner, addr1] = await ethers.getSigners();
        await bookLibrary.deployed({ from: owner });
    });

    describe("add book", function () {
        it("Should be reverted if other account is adding the book different from administrator", async function () {
            const [owner, addr1] = await ethers.getSigners();
            expect(
                bookLibrary.connect(addr1).addNewBook(dummyName, bookCopies)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should throw if name of the book is not presented", async function () {
            const [owner, addr1] = await ethers.getSigners();
            const bookWithBlankName = "";
            expect(
                bookLibrary
                    .connect(owner)
                    .addNewBook(bookWithBlankName, bookCopies)
            ).to.be.revertedWith("Name field must be not blank");
        });

        it("Should be created a new book from administrator and emit LogBookAdded", async function () {
            const [owner, addr1] = await ethers.getSigners();
            await expect(
                bookLibrary.connect(owner).addNewBook(dummyName, bookCopies)
            )
                .to.emit(bookLibrary, "LogBookAdded")
                .withArgs(dummyName, bookCopies);
            const allBookIds = await bookLibrary.getAllBookIds();
            const hashFirstBook = allBookIds[0];
            const getFirstBookDetail = await bookLibrary.getBookDetail(
                hashFirstBook
            );
            expect(getFirstBookDetail[0]).to.be.equal(dummyName);
        });

        it("Should throw if book with same name is already available", async function () {
            const [owner, addr1] = await ethers.getSigners();
            expect(
                bookLibrary.connect(owner).addNewBook(dummyName, bookCopies)
            ).to.be.revertedWith("Book is already available");
        });
    });

    describe("borrow book", function () {
        it("Should borrow a book and check if user is in borrow history and emit LogBookBorrowed", async function () {
            const [owner, addr1, addr2] = await ethers.getSigners();
            const allBookIds = await bookLibrary.getAllBookIds();
            const hashFirstBook = allBookIds[0];
            await expect(bookLibrary.connect(addr1).borrowBook(hashFirstBook))
                .to.emit(bookLibrary, "LogBookBorrowed")
                .withArgs(hashFirstBook);
            let borrowHistoryAddresses = await bookLibrary.getBookBorrowHistory(
                hashFirstBook
            );
            expect(borrowHistoryAddresses.length).to.equal(1);
        });

        it("Admin adds book and users can't take it because no copies left", async function () {
            const [owner, addr1, addr2] = await ethers.getSigners();
            await bookLibrary.connect(owner).addNewBook("The only one", 1);
            const allBookIds = await bookLibrary.getAllBookIds();
            const hashSecondBook = allBookIds[1];
            expect(bookLibrary.connect(addr1).borrowBook(hashSecondBook));
            expect(
                bookLibrary.connect(addr2).borrowBook(hashSecondBook)
            ).to.be.revertedWithCustomError(
                bookLibrary,
                "Library__NoCopiesLeft"
            );
        });

        it("Should throw NotBorrowed if the book is returned but not borrowed again", async function () {
            const [owner, addr1] = await ethers.getSigners();
            await bookLibrary
                .connect(owner)
                .addNewBook("Mastering Etherium", 100);
            const allBookIds = await bookLibrary.getAllBookIds();
            const hashThirdBook = allBookIds[2];
            expect(await bookLibrary.connect(addr1).borrowBook(hashThirdBook));
            expect(await bookLibrary.connect(addr1).returnBook(hashThirdBook));
            expect(
                bookLibrary.connect(owner).returnBook(hashThirdBook)
            ).to.be.revertedWithCustomError(
                bookLibrary,
                "Library__NotBorrowedBook"
            );
        });
    });
    describe("return book", function () {
        it("Should return a book and check if copies are one more and emit LogBookReturned", async function () {
            const [owner, addr1, addr2] = await ethers.getSigners();
            const allBookIds = await bookLibrary.getAllBookIds();
            const hashFirstBook = allBookIds[0];
            const oldCopiesCount = await bookLibrary.getBookDetail(
                hashFirstBook
            );
            await expect(bookLibrary.connect(addr1).returnBook(hashFirstBook))
                .to.emit(bookLibrary, "LogBookReturned")
                .withArgs(hashFirstBook);
            const newCopiesCount = await bookLibrary.getBookDetail(
                hashFirstBook
            );
            expect(parseInt(newCopiesCount[1])).to.be.equal(
                parseInt(oldCopiesCount[1]) + 1
            );
        });
        
        it("Get number of books in library", async function () {
            const numberOfBooks = await bookLibrary.getNumberOfBooks();
            expect(parseInt(numberOfBooks)).to.equal(3);
        });
    });
});
