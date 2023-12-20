import React,{useState} from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FlightCard(props) {
  const [showDialog,setShowDialog] = useState(false);
  const [open,setOpen] = useState(false);
  const [message,setMessage] = useState('');
  const [seats,setSeats]=useState(props.availableSeats);
  const handleClick = ()=>{
      setShowDialog(true);
  }
  const handleClose = ()=>{
    setShowDialog(false);
  }
  const handleConfirm = async()=>{
    const remaining = +seats - props.people;
    const body = {
      id: props.flightNumber,
      name: props.flightName,
      people: remaining
    }
    await axios.post('http://localhost:9000/book_tickets',body)
    .then((res)=>{
        setMessage(res.data.message);
        setOpen(true);
        setSeats(remaining.toString());
        setShowDialog(false);
    })
    .catch(err=>{
      console.log(err);
    });
  }
  return (
    <div className="flight-card p-[1rem] font-semibold my-[2rem] rounded-[1rem] bg-[#B4D2E7] max-w-screen md:min-w-[30rem]">
      <h2 className='text-[2.5rem] w-full mb-[1rem] text-center font-bold'>{props.flightName}</h2>
      <p className='text-[1.3rem] mb-[2rem]'>Flight Number: {props.flightNumber}</p>
      <div className='w-full text-[1.2rem] mb-[1.5rem] flex flex-wrap flex-row justify-between'>
        <p>Departure Time: {props.departureTime}</p>
        <p>Arrival Time: {props.arrivalTime}</p>        
      </div>
      <div className="w-full text-[1.2rem] mb-[1rem] flex flex-wrap flex-row justify-between">
        <p>Available Seats: {seats}</p>
        <p>Date: {props.date}</p>
      </div>
      <div className="w-full text-[1.2rem] mb-[1rem] flex flex-wrap flex-row justify-between">
        <p>Trip Type: {(props.trip === 'ROUND_TRIP')?'ROUND TRIP':'ONE WAY'}</p>
        <p>Cabin: {props.cabin} CLASS</p>
      </div>
        <button className='w-full text-[1.3rem] p-[1rem] bg-[#000100] text-[#F8F8F8] rounded-[0.5rem] hover:bg-[#A1A6B4] hover:text-[#000100] cursor-pointer ' onClick={handleClick}>Book (₹{props.price}) + {props.people}</button>
        <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Booking"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Book {props.people} tickets for ₹{+props.price*props.people}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={open}  onClose={()=>{setOpen(false)}}>
        <Alert onClose={()=>{setOpen(false)}} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
    
  );
}
