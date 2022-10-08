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
        const createBookAdmin = await bookLibrary.connect(owner).addNewBook(dummyName, bookCopies);
        await createBookAdmin.wait();

        const getFirstBookDetail = await bookLibrary.getBookDetail(1);
        const detail = await getFirstBookDetail;
        expect(detail[0]).to.be.equal(dummyName);
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
        await bookLibrary.borrowBook(1);
        expect(await bookLibrary.getBookBorrowHistory(1)).to.have.length(1);
    });

    it("Admin adds book and users can't take it because no copies left", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const bookOneCopy = await bookLibrary.connect(owner).addNewBook("The only one", 1);
        await bookOneCopy.wait();
        expect(bookLibrary.connect(addr1).borrowBook(1))
        expect(bookLibrary.connect(addr2).borrowBook(1))
            .to.be.revertedWith("There are no copies of this book left.");
    });

    it("Should return a book and check if copies are one more", async function () {
        const getBookDetailBefore = await bookLibrary.getBookDetail(1);
        await bookLibrary.returnBook(1);
        const newCopiesCount = await bookLibrary.getBookDetail(1);
        expect(newCopiesCount[1].toNumber()).to.be.equal(getBookDetailBefore[1].toNumber() + 1);
    });

});