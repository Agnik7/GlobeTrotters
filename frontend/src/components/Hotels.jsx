import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import HotelCard from './HotelCard';
export default function Hotels() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const handleBack=()=>{

      navigate('/book');
      
    }
    const hotelName = state.hotelData.hotelName;
    const hotelId = state.hotelData.hotelId;
    const availableRoom = state.hotelData.availableRooms;
    const price = state.hotelData.price;
  return (
    <div className='bg-[#6a040f] min-h-screen'>
      <div className='flex flex-row items-center justify-between px-2'>
        <h1 className='text-[#ffba08] text-[3rem] font-bold mx-[2rem]'>Hotels in {state.hotelData.location}</h1>
        <span className="material-symbols-outlined text-[#ffba08] text-[3rem] mr-[1rem] hover:cursor-pointer" onClick={handleBack}>arrow_back</span>
      </div>
      <div className="flight-card-container w-full  flex flex-row flex-wrap justify-evenly">
      {hotelId.map((number, index) => (
          <HotelCard
            key={index}
            hotelName={hotelName[index]}
            hotelNumber={number}
            availableRooms={availableRoom[index]}
            checkIn={state.hotelData.checkIn}
            checkOut={state.hotelData.checkOut}
            price={price[index]}
            people={state.hotelData.people}
            rooms = {state.hotelData.rooms}
            roomType = {state.hotelData.roomType}
            location = {state.hotelData.location}
          />
        ))}
      </div>
    </div>
  )
}
