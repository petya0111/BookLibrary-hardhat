const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookLibrary", function () {
    let dummyName = "Lorem Ipsum";
    let bookCopies = 50;
    let connectAdmin;
    let connectClient1;

    let address1;
    before(async () => {
        let bookLibraryFactory = await ethers.getContractFactory("Library");
        let bookLibrary = await bookLibraryFactory.deploy();
        const [owner, addr1, addr2] = await ethers.getSigners();
        address1 = addr1;
        connectAdmin = bookLibrary.connect(owner);
        connectClient1 = bookLibrary.connect(addr1);
        connectClient2 = bookLibrary.connect(addr2);
        await bookLibrary.deployed({ from: owner });
    });

    it("Should be reverted if other account is adding the book different from administrator", async function () {
        expect(connectClient1.addNewBook(dummyName, bookCopies))
            .to.be.rejectedWith('Ownable: caller is not the owner');
    });

    it("Should throw if name of the book is not presented", async function () {
        const bookWithBlankName = "";
        expect(connectAdmin.addNewBook(bookWithBlankName, bookCopies))
            .to.be.rejectedWith("Name field must be not blank");
    });

    it("Should be created a new book from administrator", async function () {
        expect(await connectAdmin.addNewBook(dummyName, bookCopies));
    });

    it("Should throw if the book is not borrowed but return action is initiated", async function () {
        expect(connectAdmin.returnBook(1))
            .to.be.rejectedWith("Book is not borrowed.");
    });

    it("Should throw if book with same name is already available", async function () {
        expect(connectAdmin.addNewBook(dummyName, bookCopies))
            .to.be.rejectedWith("Book is already available");
    });

    it("Should borrow a book and check if user is in borrow history", async function () {
        await connectClient1.borrowBook(1);
        expect(await connectClient1.getBookBorrowHistory(1))
            .to.eql([`${await address1.getAddress()}`]); // eql deeply compare
    });

    it("Should throw that book is already borrowed", async function () {
        expect(connectClient1.borrowBook(1))
            .to.be.rejectedWith("Book is already borrowed.");
    });

    it("Admin adds book and users can't take it because no copies left", async function () {
        await connectAdmin.addNewBook("The only one", 0);
        expect(connectClient2.borrowBook(1))
            .to.be.rejectedWith("There are no copies of this book left.");
    });

    it("Should return a book and check if copies are one more", async function () {
        const { 1: beforeCopiesCount } = await connectClient1.getBookDetail(1);
        await connectClient1.returnBook(1);
        const { 1: copiesCount } = await connectClient1.getBookDetail(1);
        expect(parseInt(copiesCount)).to.equal(parseInt(beforeCopiesCount) + 1);
    });

});