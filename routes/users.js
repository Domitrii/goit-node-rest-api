import express from 'express'
import UserController from '../controllers/auth.js'
import uploadMiddleware from '../middleware/upload.js'

const router = express.Router()

router.patch('/avatars', uploadMiddleware.single("avatar") , UserController.changeAvatar)

export default router
