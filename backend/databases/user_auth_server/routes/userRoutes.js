const express = require('express');
const { registerUser, loginUser, logoutUser, trackUserItem, getUserTrackedItems, deleteUserTrackedItem, setAlert } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.post('/track-user-item', trackUserItem);
router.get('/item-tracking/:userId', getUserTrackedItems)
router.delete('/item-tracking/:userId/:productId', deleteUserTrackedItem)
router.post('/set-alert', setAlert)


module.exports = router;
