import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()

const getUsers = async (req, res) => {
  try{
    const {userId} = req.user
    const usr = await User.findById(userId)
  if(usr.role === 'admin' || usr.role === 'superuser'){
    const foundUser = await User.find()
    res.send(foundUser)
  }else{
    res.sendStatus(403).send('Acess denied, or user not found')
  }
}catch (error){
  console.error(error,'user not found')
}
}

const getUsersById = async (req, res) => {

  try{
      const {userId} = req.user
      const usr = await User.findById(userId)
    if(usr.role === 'admin' || usr.role === 'superuser'){
      const foundUser = await User.findById(req.params.id)
      res.send(foundUser)
    }else{
      res.sendStatus(403).send('Acess denied, or user not found')
    }
  }catch (error){
    console.error(error,'user not found')
  }

}

const updateUser = async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, req.body)
  console.log('result ', result)
  res.sendStatus(503)
}

const deleteUser = async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, { active: false })
  console.log('result ', result)
  res.sendStatus(503)
}

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter
