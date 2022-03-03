import React, {useState} from "react"
import { Button, Stack, TextField } from "@mui/material"
import axios from 'axios'

const CreateFlashcard = ({ userId, deckId }) => {

  // how can we use state here to make sure we're validating info
  console.log(`[CreateFlashcard] deckId is ${deckId}`)
  const [formValue, setFormValue] = useState({frontImage : '', frontText : '', backImage: '', backText: '',
                                              frontImageError : '', frontTextError : '', backImageError : '', backTextError : '' })
  /*const frontImage = formValue.frontImage
  const frontText = formValue.frontText
  const backImage = formValue.backImage
  const backText = formValue.backText*/


  // helper function to validate if its a url not used yet
  const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)


  }

  //validate form
  validateForm = () => {

    const frontImageError = '';
    const frontTextError = '';
    const backImageError = '';
    const backTextError = '';

    if (this.useState.frontImage){
      frontImageError = 'Enter image url'
    }

    if (this.useState.backImage){
      backImageError = 'Enter image url'
    }

    if (this.useState.frontText){
      frontTextError = 'Enter front imgage description'

    }

    if (this.useState.backText){
      backTextError = 'Enter back image description'
    }
    if (frontImageError || backImageError || frontTextError || backImageError){
      this.useState({
        frontImageError,backImageError,frontTextError, backTextError
      });
      return false;
    }
    return true

  }
  
  const handleChange = (event) => {
    if(validateForm){
      event.validateForm
      event.preventDefault()
      console.log("[CreateFlashcard] onChange ", event)
      const currentValues = formValue
      currentValues[event.target.name] = event.target.value
      setFormValue(currentValues)
    }
  }
  
  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
      console.log(`[createflashcard] response submit ${response.status}`)
    } catch (err) {
      console.log(`response error ${err.status}`)
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <span>Form values: {formValue.frontText} &amp; {formValue.backText}</span>
      <TextField
        margin="normal"
        required
        fullWidth
        id="frontImage"
        label="Front Image"
        name="frontImage"
        onChange={handleChange}
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="frontText"
        label="Front Text"
        id="frontText"
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="backImage"
        label="Back Image"
        name="backImage"
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="backText"
        label="Back Text"
        id="backText"
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Stack>
  )
}

export default CreateFlashcard
