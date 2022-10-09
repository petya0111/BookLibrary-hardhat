// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

error NoCopiesLeft();

contract Library is Ownable {
    using SafeMath for uint256; // to prevent overflowing numbers

    struct Book {
        string name;
        uint256 numberOfCopies;
        uint256 ownerCount;
        mapping(uint256 => address) borrowedUserIds;
    }

    event LogBookAdded(string name, uint256 id);

    uint256 public bookCountInLibrary;

    mapping(string => bool) private isBookAvailable;
    mapping(address => mapping(uint256 => bool)) private isBorrowed;
    mapping(uint256 => Book) public BookStorage;

    modifier bookIsAlreadyEntered(string memory _name) {
        require(!isBookAvailable[_name], "Book is already available");
        _;
    }

    function addNewBook(string memory _name, uint256 _numberOfCopies)
        external
        onlyOwner
        bookIsAlreadyEntered(_name)
    {
        require(bytes(_name).length != 0, "Name field must be not blank");
        isBookAvailable[_name] = true;
        uint256 newIdentifier = bookCountInLibrary.add(1); // the first book starts from id=1
        Book storage newBook = BookStorage[newIdentifier];
        newBook.name = _name;
        newBook.numberOfCopies = _numberOfCopies;
        bookCountInLibrary = bookCountInLibrary.add(1);
        emit LogBookAdded(_name, newIdentifier);
    }

    function getBookDetail(uint256 _id)
        public
        view
        returns (string memory, uint256)
    {
        return (BookStorage[_id].name, BookStorage[_id].numberOfCopies);
    }

    function borrowBook(uint256 _id) external {
        Book storage book = BookStorage[_id];
        if ((book.numberOfCopies.sub(1)) < 1) {
            revert NoCopiesLeft();
        }
        book.numberOfCopies = book.numberOfCopies.sub(1);
        isBorrowed[msg.sender][_id] = true;
        book.borrowedUserIds[book.ownerCount] = msg.sender;
        book.ownerCount = book.ownerCount.add(1);
    }

    function returnBook(uint256 _id) external {
        require(isBorrowed[msg.sender][_id], "Book is not borrowed.");
        Book storage book = BookStorage[_id];
        book.numberOfCopies = book.numberOfCopies.add(1);
        isBorrowed[msg.sender][_id] = false;
    }

    function getBookBorrowHistory(uint256 _id)
        public
        view
        returns (address[] memory)
    {
        address[] memory addressesUsers = new address[](
            BookStorage[_id].ownerCount
        );
        for (uint256 idx = 0; idx < BookStorage[_id].ownerCount; idx++) {
            addressesUsers[idx] = BookStorage[_id].borrowedUserIds[idx];
        }
        return addressesUsers;
    }
}
