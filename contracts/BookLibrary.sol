// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

error Library__NoCopiesLeft();
error Library__NotBorrowedBook();

contract Library is Ownable {
    struct Book {
        string name;
        /* bytes32 pass input params and long sentences with keccak, to encode them and transfer it to bytes
         and then you can keep a hash, it is more gas optimized.
         We can use the hash to keep all the books by hash and map them by the real book struct
         And then you can access this hash and get the book. You are going to keep array of hashes.
         we can use it here for uinique isbn number of the books */
        uint16 numberOfCopies; // 2**16=65536
        address[] borrowedUserIds;
    }
    bytes32[] public bookKey;

    mapping(string => bool) private isBookAvailable;
    mapping(address => mapping(bytes32 => bool)) private isBorrowed;
    mapping(bytes32 => Book) public BookStorage;

    event LogBookAdded(string indexed name, uint32 indexed copies); 
    // every state changing function needs to emit event
    // it is cheap way to write something into the blockchain
    // indexed keyword for fast searching up to 3 idx params on event
    event LogBookBorrowed(bytes32 indexed id);
    event LogBookReturned(bytes32 indexed id);

    modifier bookIsAlreadyEntered(string memory _name) {
        require(!isBookAvailable[_name], "Book is already available");
        _;
    }

    function addNewBook(string calldata _name, uint16 _numberOfCopies)
        external
        onlyOwner
        bookIsAlreadyEntered(_name)
    {
        require(bytes(_name).length != 0, "Name field must be not blank");
        isBookAvailable[_name] = true;
        address[] memory borrowed;
        Book memory newBook = Book(_name, _numberOfCopies, borrowed);
        BookStorage[keccak256(abi.encodePacked(_name))] = newBook;
        bookKey.push(keccak256(abi.encodePacked(_name)));
        emit LogBookAdded(_name, _numberOfCopies);
    }

    function borrowBook(bytes32 _id) external {
        Book storage book = BookStorage[_id];
        if ((book.numberOfCopies - 1) < 1) {
            revert Library__NoCopiesLeft();
        }
        book.numberOfCopies = book.numberOfCopies - 1;
        isBorrowed[msg.sender][_id] = true;
        book.borrowedUserIds.push(msg.sender);
        emit LogBookBorrowed(_id);
    }

    function returnBook(bytes32 _id) external {
        if (isBorrowed[msg.sender][_id] == false) {
            revert Library__NotBorrowedBook();
        }
        Book storage book = BookStorage[_id];
        book.numberOfCopies = book.numberOfCopies + 1;
        isBorrowed[msg.sender][_id] = false;
        emit LogBookReturned(_id);
    }

    function getBookDetail(bytes32 _id)
        public
        view
        returns (string memory, uint16)
    {
        return (BookStorage[_id].name, BookStorage[_id].numberOfCopies);
    }

    function getNumberOfBooks() public view returns (uint256) {
        return bookKey.length;
    }

    function getAllBookIds() public view returns (bytes32[] memory) {
        return bookKey;
    }

    function getBookBorrowHistory(bytes32 _id)
        public
        view
        returns (address[] memory)
    {
        return BookStorage[_id].borrowedUserIds;
    }
}
