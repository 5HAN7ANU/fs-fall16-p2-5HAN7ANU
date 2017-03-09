var express = require('express');
var posts = require('./controllers/posts.ctrl');
var users = require('./controllers/users.ctrl');
var categories = require('./controllers/categories.ctrl');
var contact = require('./controllers/contact.ctrl');
var donations = require('./controllers/donations.ctrl');

var router = express.Router();

router.use('/posts', posts);
router.use('/users', users);
router.use('/categories', categories);
router.use('/contact', contact);
router.use('/donations', donations);

module.exports = router;