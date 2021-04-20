import express from 'express'
import cookieParser from 'cookie-parser'
import userRouter from './routers/userRouter'
import dotenv from 'dotenv';
import { initDatabase, seedUsers } from './dal/database'

const app = express()
const port = 3000
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

(async () => {
    await initDatabase();
    await seedUsers();
})();

// ---------------------------------- 
// Application properties
// ----------------------------------
app.set('appName', 'Hung Quach\'s homework 2')


// ----------------------------------
// Application settings
// ----------------------------------
///app.set('case sentitive routing', true)
//app.set('strict routing', true)
//app.set('x-powered-by', false)

// ----------------------------------
// Application level middileware
// ----------------------------------
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    console.log(`Timestamp ${Date.now()} - ${req.method} ${req.originalUrl}`)
    console.log('Cookies: ', req.cookies)
    next()
})

// ----------------------------------
// Route
// ----------------------------------
app.use(userRouter)

app.get('/test', (req, res) => {

    console.log('hello');
    res.json('hello')
})

// ----------------------------------
// Error-handling middleware
// ----------------------------------
app.use((req, res, next) => {
    throw new Error('Error!')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal server error')
    next(err)
})


app.listen(port, () => console.log(`Server is listening on port ${port}!`))