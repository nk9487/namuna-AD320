import mongoose from 'mongoose'

//create user
const User = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userId:  String
})

export const userInfo = mongoose.model('userInfo', User)