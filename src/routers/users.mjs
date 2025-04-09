import { response, Router } from "express";
import {User} from '../mongoose/user.mjs'
import {hashPassword} from '../utils/helpers.mjs'

const router = Router()

router.get('/users', async (req, res) => {
    try {
        console.log(12)
        const users = await User.find()
        if (!users) return res.status(404).send({message: 'users not found'})
        res.status(200).send(users)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/users/:id', async (req, res) => {
    const {params} = req
    try {
        const findUser = await User.findById(params.id)
        if (!findUser) return res.status(404).send({message: 'user is not found'})
        res.status(200).send(findUser)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/users', async (req, res) => {
    const {body} = req

    body.password = hashPassword(body.password)

    const newUser = new User(body)

    try {
        const savedUser = await newUser.save()
        return res.status(201).send(newUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

router.patch('/users/:id', async (req, res) => {
    try {

        req.body.password = hashPassword(req.body.password)

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
    
        if (!updatedUser) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
    
        res.send(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).send(deletedUser)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router