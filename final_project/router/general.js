const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

public_users.get("/", function (req, res) {
  return res.status(200).json({ books: JSON.stringify(books) });
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json({ book: JSON.stringify(book) });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: JSON.stringify(booksByAuthor) });
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  for (const isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json({ books: JSON.stringify(booksByTitle) });
  } else {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json({ reviews: JSON.stringify(book.reviews) });
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});

module.exports.general = public_users;
