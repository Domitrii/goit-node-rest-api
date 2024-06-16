import jwt from 'jsonwebtoken'
import User from '../modules/user.js'

function auth(req, res, next){
  const authorization = req.headers.authorization

    if(typeof authorization !== "string"){
        return res.status(400).send({message: "Invalid authorization header"})
    }

    const [bearer, token] = authorization.split(' ', 2)
    if(bearer !== 'Bearer'){
        return res.status(401).send({message: 'Invalid token format'})
    }

    jwt.verify(token, process.env.SECRET_PASS, async (err, decode) =>{
        if(err){
            return res.status(401).send({message: "Invalid token"})
        }
        try{
            const user = await User.findById(decode.id)
            if(!user || user.token !== token){
                return res.status(401).send({message: "Invalid token"})
            }
            req.user = {id: decode.id, email: decode.email, subscription: decode.subscription}
            next()
        } catch (error){
            next(error)
        }

    })    


}

export default auth



