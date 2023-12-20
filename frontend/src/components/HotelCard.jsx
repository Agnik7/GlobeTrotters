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

export default function HotelCard(props) {
    const [showDialog,setShowDialog] = useState(false);
    const [rooms,setRooms]=useState(props.availableRooms);
const [open,setOpen] = useState(false);
const [message,setMessage] = useState('');
const handleClick = ()=>{
    setShowDialog(true);
}
const handleClose = ()=>{
  setShowDialog(false);
}
const handleConfirm = async()=> {
    const remaining = +rooms - props.rooms;
    const body = {
        id: props.hotelNumber,
        name: props.hotelName,
        rooms: remaining,
        location: props.location
      }
    await axios.post('http://localhost:9000/book_rooms',body)
    .then((res)=>{
        setMessage(res.data.message);
        setOpen(true);
        setRooms(remaining.toString());
        setShowDialog(false);
    })
    .catch(err=>{
      console.log(err);
    });
}
  return (
    <div className="flight-card p-[1rem] font-semibold my-[2rem] rounded-[1rem] bg-[#faa307] max-w-screen md:min-w-[30rem]">
      <h2 className='text-[2.5rem] w-full mb-[1rem] text-center font-bold'>{props.hotelName}</h2>
      <p className='text-[1.3rem] mb-[2rem]'>Hotel Number: {props.hotelNumber}</p>
      <div className='w-full text-[1.2rem] mb-[1.5rem] flex flex-wrap flex-row justify-between'>
        <p>Check-in: {props.checkIn}</p>
        <p>Check-out: {props.checkOut}</p>        
      </div>
      <div className="w-full text-[1.2rem] mb-[1rem] flex flex-wrap flex-row justify-between">
        <p>Rooms Available: {rooms}</p>
        <p>Type of Room: {props.roomType}</p>
      </div>
        <button className='w-full text-[1.3rem] p-[1rem] bg-[#d00000] text-[yellow] rounded-[0.5rem] hover:bg-[#dc2f02] hover:text-[#ffba08] cursor-pointer ' onClick={handleClick}>Book (₹{props.price}) + {props.rooms}</button>
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
            Book {props.rooms} Rooms for ₹{+props.price*props.rooms}?
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
  )
}
