import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()

function sanitizeUsers(users){
  const sanitizedUsers = users.map((user) =>({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email:  user.email,
      decks: user.decks,
      active: user.active
    }))
    return sanitizedUsers
  }
const getUsers = async (req, res) => {
  
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || requestor.role === 'superuser') {
    const users = await User.find({})
    res.send(sanitizeUsers(users))
  } else {
    res.sendStatus(403).send('Forbidden')
  }

}
const getUsersById = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  console.log(`[getUsersById] found requestor ${requestor} for userId ${userId} from param ${req.params.id}`)
  if (requestor.role === 'admin' || requestor.role === 'superuser' ||  requestor._id.toString() === req.params.id.toString()) 
  {
    const user = await User.findById(req.params.id)
    const arr = sanitizeUsers([user])
    res.send(arr[0])
  } else {
    res.sendStatus(403)
  }
}

const updateUser = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin'||  requestor._id.toString() === req.params.id.toString()) {
    const result = await User.findByIdAndUpdate(req.params.id, req.body)
    console.log('result ', result)
    res.sendStatus(503)
  }else{
    res.sendStatus(403).send('Forbidden')
  }
}

const deleteUser = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if(requestor.role === 'admin' || requestor._id.toString() === req.params.id.toString()){
    const result = await User.findByIdAndUpdate(req.params.id, { active: false })
    console.log('result ', result)
    res.sendStatus(503)
  }else{
    res.sendStatus(403).send('Forbidden')
  }
}
usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)


export default usersRouter
