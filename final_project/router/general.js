const express = require('express');
let books = require("./booksdb.js"); // Corrected path
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books); // Simulating async operation
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  Promise.resolve(books[isbn])
    .then(book => {
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => res.status(500).json({ message: "Error retrieving book" }));
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  Promise.resolve(Object.values(books).filter(book => book.title === title))
    .then(booksByTitle => {
      if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
      } else {
        res.status(404).json({ message: "No books found with this title" });
      }
    })
    .catch(error => res.status(500).json({ message: "Error retrieving books" }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
