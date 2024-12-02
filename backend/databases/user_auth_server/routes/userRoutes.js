import express from 'express'
import { registerUser, loginUser, logoutUser, trackUserItem, getUserTrackedItems, deleteUserTrackedItem, setAlert } from '../controllers/userController.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.post('/track-user-item', trackUserItem);
router.get('/item-tracking/:userId', getUserTrackedItems)
router.delete('/item-tracking/:userId/:productId', deleteUserTrackedItem)
router.post('/set-alert', setAlert)

export default router