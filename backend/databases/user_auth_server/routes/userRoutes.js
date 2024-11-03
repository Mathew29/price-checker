const express = require('express');
const { registerUser, loginUser, logoutUser, trackUserItem } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.post('/track-user-item', trackUserItem);

module.exports = router;
