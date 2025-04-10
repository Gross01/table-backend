import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    date: {
        type: mongoose.Schema.Types.Object, 
        required: true, 
    }, 
    price: {
        type: mongoose.Schema.Types.String, 
        required: true, 
    },
    product: {
        type: mongoose.Schema.Types.Object, 
        required: true, 
    },
    place: {
        type: mongoose.Schema.Types.String, 
        required: true, 
    },
    orderNumber: {
        type: mongoose.Schema.Types.String, 
        required: true, 
    },
})

export const Order = mongoose.model('Order', OrderSchema)