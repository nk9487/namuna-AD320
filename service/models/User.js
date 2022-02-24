import mongoose from 'mongoose'

//create user
const User = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userId:  mongoose.Types.ObjectId
})

export const Users = mongoose.model('User', User)