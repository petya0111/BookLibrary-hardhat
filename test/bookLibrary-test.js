const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("BookLibrary", function () {
    let dummyName = "Lorem Ipsum"
    let bookCopies = 50
    let bookLibrary
    let bookLibraryFactory
    let bookIds
    before(async () => {
        bookLibraryFactory = await ethers.getContractFactory("Library")
        bookLibrary = await bookLibraryFactory.deploy()
        const [owner, addr1] = await ethers.getSigners()
        await bookLibrary.deployed({ from: owner })
    })

    it("Should be reverted if other account is adding the book different from administrator", async function () {
        const [owner, addr1] = await ethers.getSigners()
        expect(
            bookLibrary.connect(addr1).addNewBook(dummyName, bookCopies)
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("Should throw if name of the book is not presented", async function () {
        const [owner, addr1] = await ethers.getSigners()
        const bookWithBlankName = ""
        expect(
            bookLibrary.connect(owner).addNewBook(bookWithBlankName, bookCopies)
        ).to.be.revertedWith("Name field must be not blank")
    })

    it("Should be created a new book from administrator", async function () {
        const [owner, addr1] = await ethers.getSigners()
        await bookLibrary.connect(owner).addNewBook(dummyName, bookCopies)
        const hashFirstBook = await bookLibrary.getAllBookIds()
        const getFirstBookDetail = await bookLibrary.getBookDetail(
            hashFirstBook[0]
        )
        expect(getFirstBookDetail[0]).to.be.equal(dummyName)
    })

    it("Should throw if the book is not borrowed but return action is initiated", async function () {
        const [owner, addr1] = await ethers.getSigners()
        const hashSecondBook = await bookLibrary.getAllBookIds()
        expect(
            bookLibrary.connect(owner).returnBook(hashSecondBook[1])
        ).to.be.revertedWithCustomError(bookLibrary, "Library__NotBorrowedBook")
    })

    it("Should throw if book with same name is already available", async function () {
        const [owner, addr1] = await ethers.getSigners()
        expect(
            bookLibrary.connect(owner).addNewBook(dummyName, bookCopies)
        ).to.be.revertedWith("Book is already available")
    })

    it("Should borrow a book and check if user is in borrow history", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners()
        const hashFirstBook = await bookLibrary.getAllBookIds()
        await bookLibrary.connect(addr1).borrowBook(hashFirstBook[0])
        let borrowHistoryAddresses = await bookLibrary.getBookBorrowHistory(
            hashFirstBook[0]
        )
        expect(borrowHistoryAddresses.length).to.equal(1)
    })

    it("Admin adds book and users can't take it because no copies left", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners()
        await bookLibrary.connect(owner).addNewBook("The only one", 1)
        const hashSecondBook = await bookLibrary.getAllBookIds()
        expect(bookLibrary.connect(addr1).borrowBook(hashSecondBook[1]))
        expect(
            bookLibrary.connect(addr2).borrowBook(hashSecondBook[1])
        ).to.be.revertedWithCustomError(bookLibrary, "Library__NoCopiesLeft")
    })

    it("Should return a book and check if copies are one more", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners()
        const hashFirstBook = await bookLibrary.getAllBookIds()
        const oldCopiesCount = await bookLibrary.getBookDetail(hashFirstBook[0])
        await bookLibrary.connect(addr1).returnBook(hashFirstBook[0])
        const newCopiesCount = await bookLibrary.getBookDetail(hashFirstBook[0])
        expect(parseInt(newCopiesCount[1])).to.be.equal(
            parseInt(oldCopiesCount[1]) + 1
        )
    })

    it("Get number of books in library", async function () {
        const numberOfBooks = await bookLibrary.getNumberOfBooks()
        expect(parseInt(numberOfBooks)).to.equal(2)
    })
})
