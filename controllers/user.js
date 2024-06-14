import * as fs from 'node:fs/promises'
import path from 'node:path'

import User from '../modules/user.js'

async function changeAvatar(req, res, next){
    try{
        await fs.rename(req.file.path, path.resolve("public", "avatars", req.file.filename))

        const user = await User.findByIdAndUpdate(req.user.id, {avatarURL: req.file.filename}, {new: true})
        
        res.send(user)
    } catch (error){
        next(error)
    }
}



export default {
    changeAvatar
}