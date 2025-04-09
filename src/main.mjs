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
import fs from 'fs'
import https from 'https'

const app = express()

const PORT = 8080

mongoose.connect('mongodb://109.73.205.115:27017/tableData')
    .then(() => console.log('Подключен к базе данных'))
    .catch(err => console.log(err));
    
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: 'https://bsoffice.ru', 
    credentials: true                     
}));

app.use(
    session({
        secret: "artem the dev",
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 60000 * 60 * 24 * 7,
            sameSite: 'none',
            domain: '.bsoffice.ru',
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        })
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(usersRouter)
app.use(ordersRouter)
app.use(authRoutres)

app.get('/', (req, res) => {
    res.sendStatus(200)
})

const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.bsoffice.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.bsoffice.ru/fullchain.pem'),
};

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS запущен на порту ${PORT}`)
})