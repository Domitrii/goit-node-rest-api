import express from 'express'
import UserController from '../controllers/contactsControllers.js'
import uploadMiddleware from '../middleware/upload.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.patch('/avatar', authMiddleware ,uploadMiddleware.single("avatar") , UserController.changeAvatar)
router.get('/verify/:token', UserController.verifyEmail)

export default router
