import express from 'express'
import joi from 'joi'
import { v4 as uuidv4 } from 'uuid';
import { validateSchema } from './utils'

const userRouter = express.Router();

const userSchema = joi.object().keys({
    id: joi.required(),
    login: joi.string().required(),
    password: joi.string().required().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-zA-Z0-9]*$/),
    age: joi.number().integer().required().min(4).max(130),
    isDeleted: joi.bool().required()
})

let users = [
    { id: uuidv4(), login: 'apple', password: '123', age: 50, isDeleted: false },
    { id: uuidv4(), login: 'banana', password: '123', age: 51, isDeleted: false },
    { id: uuidv4(), login: 'lemon', password: '123', age: 52, isDeleted: false },
    { id: uuidv4(), login: 'watermelon', password: '123', age: 53, isDeleted: false },
    { id: uuidv4(), login: 'peach', password: '123', age: 54, isDeleted: false },
    { id: uuidv4(), login: 'cherry', password: '123', age: 55, isDeleted: false }
]

userRouter.get('/users', (req, res) => {
    console.log('Getting all users in memory', users)
    const { order = 'asc' }= req.query
    
    return (order === 'asc') ? res.json(users) : res.json(users.reverse())
})

userRouter.get('/users/:id', (req, res) => {
    const { id } = req.params
    console.log(`Get user by id ${id}`)
    
    let user = users.find(user => user.id === id)

    if(user === undefined){
        const message = `User with id ${id} not found`;
        console.error(message)
        res.status(404).json({message: message})
    } else {
        console.log(`User with id ${id}: `, user)
        res.json(user)
    }

})

userRouter.get('/test2', (req, res) => {
    console.log('Getting all users in memory', users)
    const { order = 'asc' }= req.query
    
    return (order === 'asc') ? res.json(users) : res.json(users.reverse())
})

userRouter.get('/getAutoSuggestUsers', (req, res) => {

    console.log('Getting auto suggest users in memory', users)
    const { loginSubstring = '', limit = 10} = req.query

    let filteredUsers = users.filter(user => user.login.includes(loginSubstring)).sort((a, b) => b.login - a.login).slice(0, limit)
    
    return res.json(filteredUsers)

})

userRouter.post('/users', validateSchema(userSchema), (req, res) => {
    const user = req.body
    users = [...users, user]
    res.json(users)
})

userRouter.put('/users/:id', validateSchema(userSchema), (req, res) => {
    const { id } = req.params
    console.log(`Updating user with ${id}`)
    console.log('User request data: ', req.body)

    let user = users.find(user => user.id === id)
    if(user === undefined){
        const message = `User with id ${id} not found`;
        console.error(message)
        res.status(404).json({message: message})
    } else {
        user = Object.assign(user, req.body)
        console.log(`Updated user with ${id}: `, user)
        res.json(user)
    }
})

userRouter.delete('/users/:id', (req, res) => {
    const { id } = req.params
    console.log(`Deleting user with ${id}`)

    let user = users.find(user => user.id === id)
    if(user === undefined){
        const message = `User with id ${id} not found`;
        console.error(message)
        res.status(404).json({message: message})
    } else {
        user.isDeleted = true
        console.log(`Deleted user with ${id}: `, user)
        res.json(user)
    }
})

export default userRouter