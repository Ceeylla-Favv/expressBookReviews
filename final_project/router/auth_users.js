const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username );
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password} = req.body;
  //Validate username and password
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (authenticatedUser(username, password)){
    //Generate JWT token
    const accessToken = jwt.sign({ username}, 'secret_key', { expiresIn: '1h'});

    //save user session
    req.session.user = {
      username,
      accessToken
    };

    return res.status(200).json({ message: 'User successfully logged in', accessToken}); 
     } else {
      return res.status(401).json({ message: 'Invalid username or password'});
     }

 // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;

  // Validate if user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const username = req.session.user.username;
  
  //check if the book exists 
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found'});
  }

  // Add or update the review 
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({message: 'Review successfully added/updated'});
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  //Validate if user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const username = req.session.user.username;
  // Check if book exists
  if (!books[isbn]){
    return res.status(404).json({ message: 'Book not found' });
  }

  //Delete the review
  if (books[isbn].reviews && books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Reviews successfully deleted' })
  } else {
    return res.status(404).json({ message:'Review not found' });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
