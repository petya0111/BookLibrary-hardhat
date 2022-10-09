const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("BookLibrary", function () {
    let dummyName = "Lorem Ipsum";
    let bookCopies = 50;
    let bookLibrary;
    let bookLibraryFactory;
    before(async () => {
        bookLibraryFactory = await ethers.getContractFactory("Library");
        bookLibrary = await bookLibraryFactory.deploy();
        const [owner, addr1] = await ethers.getSigners();
        await bookLibrary.deployed({ from: owner });
    });

    it("Should be reverted if other account is adding the book different from administrator", async function () {
        const [owner, addr1] = await ethers.getSigners();
        expect(bookLibrary.connect(addr1).addNewBook(dummyName, bookCopies)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("Should throw if name of the book is not presented", async function () {
        const [owner, addr1] = await ethers.getSigners();
        const bookWithBlankName = "";
        expect(bookLibrary.connect(owner).addNewBook(bookWithBlankName, bookCopies)).to.be.revertedWith("Name field must be not blank");
    });

    it("Should be created a new book from administrator", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await bookLibrary.connect(owner).addNewBook(dummyName, bookCopies);
        const getFirstBookDetail = await bookLibrary.getBookDetail(1);
        expect(getFirstBookDetail[0]).to.be.equal(dummyName);
    });

    it("Should throw if the book is not borrowed but return action is initiated", async function () {
        const [owner, addr1] = await ethers.getSigners();
        expect(bookLibrary.connect(owner).returnBook(1)).to.be.revertedWith("Book is not borrowed.");
    });

    it("Should throw if book with same name is already available", async function () {
        const [owner, addr1] = await ethers.getSigners();
        expect(bookLibrary.connect(owner).addNewBook(dummyName, bookCopies)).to.be.revertedWith("Book is already available");
    });

    it("Should borrow a book and check if user is in borrow history", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        await bookLibrary.connect(addr1).borrowBook(1);
        let borrowHistoryAddresses = await bookLibrary.getBookBorrowHistory(1);
        expect(borrowHistoryAddresses).to.have.length(1);
    });

    it("Should borrow a book that is already borrowed for the same user", async function () {
        expect(bookLibrary.borrowBook(1)).to.be.revertedWith("Book is already borrowed from the same user.");
    });

    it("Admin adds book and users can't take it because no copies left", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        await bookLibrary.connect(owner).addNewBook("The only one", 1);
        expect(bookLibrary.connect(addr1).borrowBook(2));
        expect(bookLibrary.connect(addr2).borrowBook(2))
            .to.be.revertedWithCustomError(bookLibrary, "NoCopiesLeft");
    });

    it("Should return a book and check if copies are one more", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const oldCopiesCount = await bookLibrary.getBookDetail(1);
        await bookLibrary.connect(addr1).returnBook(1);
        const newCopiesCount = await bookLibrary.getBookDetail(1);
        expect(parseInt(newCopiesCount[1])).to.be.equal(parseInt(oldCopiesCount[1]) + 1);
    });

});