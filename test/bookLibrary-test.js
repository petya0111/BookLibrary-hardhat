const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookLibrary", function () {
    let dummyName = "Lorem Ipsum";
    let bookCopies = 50;
    let bookLibrary;
    let bookLibraryFactory;
    before(async () => {
        const [owner, addr1] = await ethers.getSigners();
         bookLibraryFactory = await ethers.getContractFactory("Library");
        bookLibrary = await bookLibraryFactory.deploy();
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

        const getFirstBookDetail = await bookLibrary.connect(owner).getBookDetail(1);
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
        const [owner, addr1] = await ethers.getSigners();
        const borrowBook = await bookLibrary.connect(addr1).borrowBook(1);
        await borrowBook.wait();
        const getBorrowHistoryBook1 = await bookLibrary.connect(addr1).getBookBorrowHistory(1);
        const history = await getBorrowHistoryBook1.wait();
        expect(history.map(e=>e.addressesUsers)).to.include(addr1);
    });

    it("Admin adds book and users can't take it because no copies left", async function () {
        const [owner, addr1,addr2] = await ethers.getSigners();
        const bookOneCopy = await bookLibrary.connect(owner).addNewBook("The only one", 0);
        await bookOneCopy.wait();
        expect(bookLibrary.connect(addr2).borrowBook(1))
        .to.be.revertedWith("There are no copies of this book left.");
    });

    it("Should return a book and check if copies are one more", async function () {
        const [owner, addr1] = await ethers.getSigners();
        const getBookDetailBefore = await bookLibrary.connect(addr1).getBookDetail(1);
        console.log(getBookDetailBefore,"beforeCopiesCount");
        const beforeCopiesCount = await getBookDetailBefore.wait();
        console.log(beforeCopiesCount[1],"beforeCopiesCount");

        const returnBookPromise = await bookLibrary.connect(addr1).returnBook(1);
        await returnBookPromise.wait();

        const newCopiesCount = await bookLibrary.connect(addr1).getBookDetail(1);
        const copiesCount = await newCopiesCount.wait();
        console.log(copiesCount[1],"copiesCount");
        expect(parseInt(copiesCount[1])).to.be.equal(parseInt(beforeCopiesCount[1]) + 1);
    });

});