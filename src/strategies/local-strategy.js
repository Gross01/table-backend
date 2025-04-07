import passport from "passport";
import { Strategy } from "passport-local";
import { User } from '../mongoose/user.mjs'

passport.serializeUser((user, done) => {
    console.log('ser')
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
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
            if (!findUser) throw new Error('Пользователь не найден')
            if (findUser.password !== password) throw new Error('Неверный пароль')
            done(null, findUser)
        } catch (err) {
            done(err, null)
        }
    })
)