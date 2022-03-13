import { Router } from 'express'
import { body } from 'express-validator'
import { User } from '../models/User.js'

const decksRouter = Router()

//allowed by anyone 
const getDecks = async (req, res) => {
  const { userId, other } = req.user
  console.log(`Other data from the token ${other}`)
  try {
    const user = await User.findById(userId)
    if (user) {
      res.send(user.decks)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`${getDecks.name}: ${err}`)
    res.sendStatus(500)
  }
}
// allowed to  all
const createDeck = async (req, res) => {
  const userId = ''
  const newDeck = req.body
  try {
    const user = await User.findById(userId)
    user.decks.push({
      name: newDeck.name,
      cards: []
    })
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    console.log(`${createDeck.name}: ${err}`)
    res.sendStatus(500)
  }
}
// allowed to  all
const createCard = async (req, res) => {
  const userId = ''
  const deckId = req.params.id
  const newCard = req.body
  try {
    const user = await User.findById(userId)
    const deck = user.decks.id(deckId)
    deck.cards.push(newCard)
    await user.save()
    const newId = deck.cards[deck.cards.length - 1]
    res.status(200).send(newId._id)
  } catch (err) {
    console.log(`${createCard.name}: ${err}`)
    res.sendStatus(500)
  }
}
//allowed to admin and owner of deck
const deleteDeck = async (req, res) => {
  //const userId = ''
  const { userId } = req.user
  const deckId = req.params.id
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || requestor._id.toString() === req.params.id.toString()){
    try {
      const user = await User.findById(userId)
      const removedDeck = user.decks.id(deckId).remove()
      console.log(removedDeck)
      user.save()
      res.sendStatus(204)
    } catch (err) {
      console.log(`${deleteDeck.name}: ${err}`)
      res.sendStatus(500)
    }
  }else{
    res.sendStatus(403).send('Forbidden')
  }
}
//Allowed to admin or owner of deck
const updateDeck = async (req, res) => {
  const userId = ''
  const deckId = req.params.id
  const newDeck = req.body
  if (requestor.role === 'admin' || requestor._id.toString() === req.params.id.toString()){
    try {
      const user = await User.findById(userId)
      const deck = user.decks.id(deckId)
      deck.name = newDeck.name
      await user.save()
      res.sendStatus(204)
    } catch (err) {
      console.log(`${updateDeck.name}: ${err}`)
      res.sendStatus(500)
    }
  }else{
    res.sendStatus(403).send('Forbidden')
  }
}

decksRouter.get('/', getDecks)
decksRouter.post('/', body('name').not().isEmpty(), createDeck)
decksRouter.put(
  '/:id',
  body('name').not().isEmpty(),
  updateDeck
)
decksRouter.delete('/:id', deleteDeck)

decksRouter.post(
  '/:id/cards',
  body('frontImage').isURL(),
  body('frontText').not().isEmpty(),
  body('backImage').isURL(),
  body('backText').not().isEmpty(),
  createCard
)

export default decksRouter
