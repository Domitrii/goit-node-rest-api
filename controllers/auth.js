import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {authSchema} from '../schemas/auth.js'

import User from '../modules/user.js'
import HttpError from '../helpers/HttpError.js'

const {SECRET_PASS} = process.env

async function register(req, res, next){
    try {
        const {error} = authSchema.validate(req.body)
        if(error) throw HttpError(400, error.message)
        const { email, password } = req.body

        const user = await User.findOne({email})
        if(user) throw HttpError(409, "Email in use")

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await User.create({...req.body, password: passwordHash})
        res.status(201).send({user: {
            email: newUser.email, subscription: newUser.subscription
        }})
    } catch (error){
        next(error)
    }
}

async function login(req, res, next){
    try{
        const {error} = authSchema.validate(req.body)
        if(error) throw HttpError(400, error.message)

        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user) throw HttpError(401, "Email or password is wrong")

        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword) throw HttpError(401, "Email or password is wrong")
        
        const token = jwt.sign(
                {id: user._id}, 
                SECRET_PASS,
                {expiresIn: "23h"}
            )

        await User.findByIdAndUpdate( user.id ,{token}, {new: true})

        res.status(200).send({
            token,
            user: {
                email: user.email,
                subscription: user.subscription
            }
        })

    } catch(error){
        next(error)
    }
}

async function logout(req, res, next){
    try{
        await User.findByIdAndUpdate(req.user.id, {token: null}, {new: true})
        res.status(204).end()
    } catch(error) {
        next(error)
    }
}

async function currentUser(req, res, next){
    try{
        res.status(201).send({email: req.user.email, subscription: req.user.subscription })
    } catch(error) {
        next(error)
    }
}



export default {register, login, logout, currentUser}