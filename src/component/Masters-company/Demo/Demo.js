import { TextField, Typography ,Button,FormControl,FormLabel,RadioGroup,FormControlLabel,Radio} from '@mui/material'
import React from 'react'
import '../Demo/index.css'


function Demo() {
  return (
    <div class='container'>
        <Typography  className='h5' variant='h5'>company1</Typography>
       <div class='row'>
        <div class='col-span-2'>
        <TextField id='outlined-basic' label='First name' className='first' variant='outlined' />
       <TextField id='outlined-basic1' label='Last name' className='second' variant='outlined' />
       <div class='radio'>          
        <FormControl>
      <FormLabel id='demo'>Gender</FormLabel>
      <RadioGroup
       row
        aria-labelledby='demo-row-radio-buttons-group-label'
        name='row-radio-buttons-group'
      >
        <FormControlLabel value='female' control={<Radio />} label='Female'/>
        <FormControlLabel value='male' control={<Radio />} label='Male' />
        <FormControlLabel value='other' control={<Radio />} label='Other'/>
       
      </RadioGroup>
    </FormControl>
    </div>
       <div className='button' >
       <Button variant='contained' color='primary' >Submit</Button>
       </div>
       </div>
       </div> 
    </div>
      )
}

export default Demo
