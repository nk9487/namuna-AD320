import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { Deck } from './models/Deck.js'

//start the server
const app = express()
const port = 8000

// Connect to MongoDB
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mvxpr.mongodb.net/FlashCard?retryWrites=true&w=majority`
try {
  await mongoose.connect(connectionString)
} catch (err) {
  console.log('error ', err)
}

// Middleware

const exampleMiddleware = (req, res, next) => {
  console.log('example middleware')
  next()
}

app.use(cors())
app.use(express.json())
app.use(exampleMiddleware)

// Get  Routes

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.get('/decks', (req, res) => {
  res.sendStatus(404)
})
//==============================Get Deck by ID ==============================//

app.get('/decks/:id/cards', async (req, res) => {
  console.log('request id ', req.params.id)
  const limit = req.query.limit
  console.log('query param limit ', limit)
  const deck = await Deck.findById(req.params.id)
  if (deck){
    console.log('found card', deck.cards.length)
   res.send(deck.cards.slice(0,3))
  }else{
    res.sendStatus(404)
  }
})
//==============================Get Indvidual Card by ID==============================//
const cardsById = async (req, res) => {
  const card = await Deck.findOne({
    'cards._id': req.params.id
  })

  res.status(200).send(card)
}
app.get('/cards/:id', cardsById)

//==============================Get A Deck By A User Id==============================//

app.get('/decks/:userId/deckCards', async (req, res) => {
  console.log('user ID ', req.params.userId)
  //const limit = req.query.limit
  //console.log('query param limit ', limit)
  //const deck = await Deck.findById(req.params.userId)
  const deck = await Deck.findOne({
    'cards.userId': req.params.userId
  })
  if (deck){
    console.log('found card', deck.cards.length, deck)
    console.log(deck.size)
    console.log(deck.name)
    res.send(deck.cards)
  }else{
    res.sendStatus(404)
  }
})
//create a deck 
//create card
//create user

//update card
//update deck
//update user

//delete card
//delete card and deck all
//delete user



//=========================================================================================//

const isUrl = (value) => {
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  return re.test(value)
}


//==========================================Create Card============================================================================
app.post('/cards', async (req, res) => {
  const cardRequest = req.body
  
  if ((!cardRequest.frontImage && !cardRequest.frontText) || 
    (!cardRequest.backImage && !cardRequest.backText)) {
    res.status(400).send('Card data incomplete')
  }

  if ((frontImage && !isUrl(frontImage)) || (backImage && !isUrl(backImage))) {
    res.status(400).send('Image fields must be valid URLs')
  }

  if (!cardRequest.deckId) {
    res.status(400).send('Deck ID is required')
  }

  try {
    const deck = await Deck.findById(cardRequest.deckId)
    if (deck) {
      deck.cards.push({
        frontImage: cardRequest.frontImage,
        frontText: cardRequest.frontText,
        backImage: cardRequest.backImage,
        backText: cardRequest.backText
      })
      await deck.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})