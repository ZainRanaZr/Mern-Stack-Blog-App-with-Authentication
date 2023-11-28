const express = require('express');
const authController = require('../controller/authController');
const auth = require('../middleware/auth');
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');

const router = express.Router();

// testing
router.get("/", (req, res) => {
    res.json({ msg: "Hello" });
  });
  

// user

// register
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

// logout
router.post('/logout', auth, authController.logout);

// refresh
router.get('/refresh', authController.refresh);

// blog 
// Create
router.post('/blog', auth, blogController.createBlog)

// Read all Blogs
router.get('/blog/all', auth, blogController.getBlogAll)

// Read Blog by id
router.get('/blog/:id', auth, blogController.getBlogById)

// Update Blog by id
router.put('/blog', auth, blogController.updateBlog)

// Delete
router.delete('/blog/:id', auth, blogController.deleteBlogById)

// Comment
// Create
router.post('/comment', auth, commentController.createComment)

// Read Comment by Blog id
router.get('/comment/:id', auth, commentController.getCommentById)

// Delete

module.exports = router;