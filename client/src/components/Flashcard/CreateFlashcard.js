import React, {useState} from "react"
import { Button, Stack, tabScrollButtonClasses, TextField } from "@mui/material"
import axios from 'axios'


const CreateFlashcard = ({ userId, deckId }) => {

  console.log(`[CreateFlashcard] deckId is ${deckId}`)
  const [formValue, setFormValue] = useState({})
  const [errorValue, setErrorValue] = useState({
    frontImage :'false',
    frontText : 'false',
    backImage: 'false',
    backText: 'false',
  })


  /*const [errorValue, setErrorValue] = useState({
    frontImage :true:'Not Valid URL or is empty',
    frontText : 'Not valid Info or is empty',
    backImage: 'Not Valid URL or is empty',
    backText: 'Not valid Info or is empty',
  })*/

  const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
  }

  function validateForm (fieldName, fieldValue){
    const vlaueTrimmed = fieldValue.trim()
    if(vlaueTrimmed ===  ''){
      return false
    }
    if(!isUrl(fieldName.frontImage) || !isUrl(fieldName.backImage)){
      return false
    }
    return true
  }
  
  const handleChange = (event) => {
      event.preventDefault()
      console.log("[CreateFlashcard] onChange ", event)
      if (validateForm(event.target.name,  event.target.value)){
        const currentValues = formValue
        currentValues[event.target.name] = event.target.value
        setFormValue(currentValues)
      }else{
        console.log.apply('error ')
      }
      const currentErrorValues = errorValue
      currentErrorValues[event.target.name] = validate
      setErrorValue({[currentErrorValues]:true})
      
      
  }
  
  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
      console.log(`[createflashcard] response submit ${response.status}`)
      alert('Card Added Sussesfully')
    } catch (err) {
      console.log(`response error ${err.status}`)
      alert('Error adding card')
    } 
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <span>Form values: {formValue.frontText} &amp; {formValue.backText}</span>
      <TextField
        margin="normal"
        required true
        fullWidth
        id="frontImage"
        label="Front Image"
        name="frontImage"
        onChange={handleChange}
        autoFocus
        error = {errorValue.frontImage}
        
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="frontText"
        label="Front Text"
        id="frontText"
        onChange={handleChange}
        error = {errorValue.frontText}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="backImage"
        label="Back Image"
        name="backImage"
        onChange={handleChange}
        error = {errorValue.backImage}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="backText"
        label="Back Text"
        id="backText"
        onChange={handleChange}
        error = {errorValue.backText}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Stack>
  )
}

export default CreateFlashcard
