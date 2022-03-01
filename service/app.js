import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { Deck } from './models/Deck.js'
import { userInfo} from './models/User.js'

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
//==============================Get Deck by ID ==============================//

app.get('/decks/:id/cards', async (req, res) => {
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

//==========================================Create Card============================================================================
const isUrl = (value) => {
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  return re.test(value)
}

app.post('/cards', async (req, res) => {
  const cardRequest = req.body
  console.log(cardRequest)
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
      deck.createCards.push({
        frontImage: cardRequest.frontImage,
        frontText: cardRequest.frontText,
        backImage: cardRequest.backImage,
        backText: cardRequest.backText
      })
       deck.save()
      
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})

//===============================================create deck===========================================================================
app.post('/createDeck', async (req, res) => {
  const userRequest = req.body
  console.log(userRequest)
  if(deck){
    
  }
    try {
      const deck = await Deck.create(userRequest)
      const result = await deck.save()
      return res.sendStatus(200)
    } catch (error) {
      console.log("error creating decks")
    }

})

//===============================================create user===========================================================================
//i beliieve this wont be pushed since we have not created the user on mongodb
app.post("/createUser", async (req, res) => {
  const user = await userInfo.create(req.params.createUsers)
  try {
    const result = await user
    if (result){
      result.createUsers.push({
          firstName:user.firstName,
          lastName :user.lastName,
          userId:   user.userId
      })
      result.save()
      console.log(user)
     return res.status(201)
    }else{
      res.sendStatus(404)
    }
  } catch (error) {
    console.log('user not created')
  }
})

//==========================================Delete user============================================================================

app.post('"/deleteUser/:id"', async (req, res) => {
  const user = await userInfo.findById(req.params.id)
  try {
    if(user) {
      await user.remove()
      res.sendStatus(200)
    } else {
       res.status(404)
    }
  } catch (error) {
     res.status(404).json({
    error: "user does not exists"
    })
  }
})

//=======================================update card=================================================================================

app.put('/updatecard/:Id', async (req, res) => {
  const cardRequest = req.body

  try {
    const deck = await Deck.findById(cardRequest.deckId)
    if (deck) {
      deck.cards.forEach(card => {
        if(card._id == req.params.cardId) {
          card.frontImage = cardRequest.frontImage,
          card.frontText = cardRequest.frontText,
          card.backImage = cardRequest.backImage,
          card.backText = cardRequest.backText
        }
      });
      await deck.save()
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in updating`)
    res.sendStatus(404)
  }
})
//==================================================update deck=======================================================================

app.put("/updateDeck/:id", async (req, res) => {
  const deck = await Deck.findById(req.params.id)
  try {
   
    if(deck) {
      deck.name = req.body.name
      if(req.body.cards) {
        deck.cards = req.body.cards
        deck.cards = req.body.size
      }
      if(req.body.userId) {
        deck.userId = req.body.userId
      }
    } else {
      return res.status(404).json({
        error: "deck does not exists"
      })
    }
    const result = await deck.save()
    return res.status(200).json({
      msg: result
  })
  } catch (error) {
    console.log('error creating deck')
  }
})


//=====================================================delete card========================================================================

app.delete('/deletecard/:deckId/:cardId', async (req, res) => {

  const deck = await Deck.findById(req.params.deckId)
  try {
    
    if (deck) {
      deck.cards.forEach(card => {
        if(card._id == req.params.cardId) {
          card.remove()
        }
      });
      await deck.save()
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    console.log(`error in removing card`)
    res.sendStatus(400)
  }
})

//=============================================delete card and deck all============================================================
app.delete('/deleteDeck/:deckId', async (req, res) => {
  const deck = await Deck.findById(req.params.id)
  try {
    if(deck) {
      await deck.remove()
    } 
  } catch (error) {
    console.log('deleting deck')
    res.sendStatus(400)
  }
})

//=========================================================================================//

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})