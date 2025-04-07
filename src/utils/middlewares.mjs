// import { session } from "passport"
import { Order } from "../mongoose/order.mjs"

export const getQueryForOrders = async (req, res, next) => {
    const {query, session: {userId}} = req
    if (query.byUserId === 'true') {
        const orders = await Order.find({userId})
        if (!orders) return res.status(404).send({message: 'Заказы не найдены'})
        if (query.year) {
            const filterByYear = orders.filter(order => +order.date.year === +query.year)
            if (query.month) {
                const filterByMonth = filterByYear.filter(order => String(order.date.month) === String(query.month))
                return res.send(filterByMonth)
            }
            return res.send(filterByYear)
        }
        return res.send(orders)
    }

    const orders = await Order.find()
    if (!orders) return res.status(404).send({message: 'Заказы не найдены'})
    if (query.year) {
        const filterByYear = orders.filter(order => +order.date.year === +query.year)
        if (query.month) {
            const filterByMonth = filterByYear.filter(order => String(order.date.month) === String(query.month))
            return res.send(filterByMonth)
        }
        return res.send(filterByYear)
    }

    next()
}