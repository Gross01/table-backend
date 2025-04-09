import {Router} from 'express'
import { Order } from '../mongoose/order.mjs'
import {getQueryForOrders} from '../utils/middlewares.mjs'

const router = Router()

router.get('/orders', getQueryForOrders, async (req, res) => {
    try {
        console.log(12)
        const orders = await Order.find()
        if (!orders) return res.status(404).send({message: 'Заказы не найдены'})
        return res.status(200).send(orders)
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

router.get('/orders/:id', async (req, res) => {
    try {
        console.log(req.sessionID)
        const orders = await Order.find({userId: req.params.id})
        if (!orders) return res.status(404).send({message: 'Заказы не найдены'})
        if (req.query.year) {
        const filterByYear = orders.filter(order => +order.date.year === +req.query.year)
            if (req.query.month) {
            const filterByMonth = filterByYear.filter(order => String(order.date.month) === String(req.query.month))
                return res.send(filterByMonth)
            }
            return res.send(filterByYear)
        }
        return res.status(200).send(orders)
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

router.post('/orders', async (req, res) => {
    if (!req.session.userId) return res.status(401).send({msg: 'Пользователь не авторизован'})
    const newOrder = new Order({userId: req.session.userId , ...req.body})
    try {
        const savedOrder = await newOrder.save()
        return res.status(201).send(newOrder)
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

router.post('/orders/array', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send({ msg: 'Пользователь не авторизован' });
    }

    const ordersData = req.body;

    if (!Array.isArray(ordersData)) {
        return res.status(400).send({ msg: 'Ожидался массив заказов' });
    }

    const ordersWithUser = ordersData.map(order => ({
        ...order,
        userId: req.session.userId
    }));

    try {
        const savedOrders = await Order.insertMany(ordersWithUser);
        res.status(201).send(savedOrders);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.patch('/orders/:id', async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Заказ не найден' });
      }
  
      res.send(updatedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.delete('/orders/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)
        res.status(200).send(deletedOrder)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router