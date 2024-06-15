import express from 'express'
import UserController from '../controllers/contactsControllers.js'
import uploadMiddleware from '../middleware/upload.js'

const router = express.Router()

router.patch('/avatar', uploadMiddleware.single("avatar") , UserController.changeAvatar)

export default router
