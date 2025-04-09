import { Router } from "express";
import passport from "passport";
import { User } from "../mongoose/user.mjs";

const router = Router()

router.post('/auth', passport.authenticate('local'), async (req, res) => {
    console.log(13)
    try {
        const findUser = await User.findOne({ username: req.body.username });
        console.log(req.sessionID, req.session)
        req.session.username = findUser.username
        req.session.userId = findUser.id
        req.session.visited = true
        res.status(200).send({msg: "Вы вошли в аккаунт", userId: req.session.userId})
    } catch (err) {
        res.status(404).send({error: err.message})
    }
})

router.get('/auth/status', (req, res) => {
    if (req.session.userId) {
        return res.status(200).send({msg: `Пользователь с именем ${req.session.username} авторизирован`})
    }

    return res.status(401).send({msg: 'Пользователь не авторизирован'})
})

router.post('/auth/logout', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send({msg: 'Пользователь не авторизирован'})
    }

    req.logout((err) => {
        if (err) return res.sendStatus(400)
        res.sendStatus(200)
    })
})

export default router