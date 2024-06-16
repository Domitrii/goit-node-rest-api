import express from 'express'
import UserController from '../controllers/auth.js'
import uploadMiddleware from '../middleware/upload.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.patch('/avatars', uploadMiddleware.single("avatar") , UserController.changeAvatar)
router.get('/verify/:token', UserController.verifyEmail)


export default router
