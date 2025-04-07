import { response, Router } from "express";
import {User} from '../mongoose/user.mjs'


const router = Router()

router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
        if (!users) return res.status(404).send({message: 'users not found'})
        res.status(200).send(users)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/api/users/:id', async (req, res) => {
    const {params} = req
    try {
        const findUser = await User.findById(params.id)
        if (!findUser) return res.status(404).send({message: 'user is not found'})
        res.status(200).send(findUser)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/api/users', async (req, res) => {
    const {body} = req
    const newUser = new User(body)
    try {
        const savedUser = await newUser.save()
        return res.status(201).send(newUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

router.patch('/api/users/:id', async (req, res) => {
    try {
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

router.delete('/api/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).send(deletedUser)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router