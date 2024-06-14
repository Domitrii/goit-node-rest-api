import express from 'express'
import AuthController from '../controllers/auth.js'
import userRouter from './users.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

const jsonParser = express.json()


router.post('/register', jsonParser, AuthController.register)
router.post('/login', jsonParser, AuthController.login)
router.post('/logout', authMiddleware, AuthController.logout)
router.get('/current', authMiddleware, AuthController.currentUser)
router.patch('/avatar', authMiddleware, userRouter)

export default router