import passport from "passport";
import { Strategy } from "passport-local";
import { User } from '../mongoose/user.mjs'
import {comparePassword} from '../utils/helpers.mjs'

passport.serializeUser((user, done) => {
    console.log('ser')
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log('des')
    try {
        console.log('des')
        const findUser = await User.findById(id)
        if (!findUser) throw new Error("Пользователь не найден")
        done(null, findUser)
    } catch (err) {
        done(err, null)
    }
})

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ username })
            if (!comparePassword(password, findUser.password)) throw new Error('Неверный пароль')
            done(null, findUser)
        } catch (err) {
            done(err, null)
        }
    })
)