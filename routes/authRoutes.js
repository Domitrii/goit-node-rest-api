import express from 'express'
import AuthController from '../controllers/auth.js'

const router = express.Router()

const jsonParser = express.json()


router.post('/register', jsonParser, AuthController.register)
router.post('/login', jsonParser, AuthController.login)
router.post('/logout', jsonParser, AuthController.logout)

export default router