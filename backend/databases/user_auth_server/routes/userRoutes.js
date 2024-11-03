const express = require('express');
const { registerUser, loginUser, logoutUser, trackUserItem, getUserTrackedItems, deleteUserTrackedItem } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.post('/track-user-item', trackUserItem);
router.get('/item-tracking/:userId', getUserTrackedItems)
router.delete('/item-tracking/:userId/:productId', deleteUserTrackedItem)



module.exports = router;
