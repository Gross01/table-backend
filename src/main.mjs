import express from 'express'
import mongoose from 'mongoose'
import usersRouter  from './routers/users.mjs'
import ordersRouter from './routers/orders.mjs'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import authRoutres from './routers/auth.mjs'
import './strategies/local-strategy.js'
import cors from 'cors'

const app = express()

const PORT = 5000

mongoose.connect('mongodb+srv://artem51055:Iou1ibnMZnVb3hxz@table-cluster.dkqgf.mongodb.net/?retryWrites=true&w=majority&appName=Table-cluster')
    .then(() => console.log('Подключен к базе данных'))
    .catch(err => console.log(err))
    

app.use(express.json())
app.use(cookieParser())
app.use(
    session({
        secret: "artem the dev",
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 60000 * 60 * 24 * 7,
            domain: 'localhost',
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        })
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(usersRouter)
app.use(ordersRouter)
app.use(authRoutres)

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.listen(PORT, () => console.log('Сервер запущен'))