import mongoose from 'mongoose'

//creating database schema
const CardSchema = new mongoose.Schema({
    frontImage: String,
    frontText: String,
    backImage: String,
    backText: String
})

const DeckSchema = new mongoose.Schema({
    name: String,
    cards: [CardSchema],
    size:Number,
    userID: mongoose.Types.ObjectID
})

export const Deck = mongoose.model('Deck', DeckSchema)