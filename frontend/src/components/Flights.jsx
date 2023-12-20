import React from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import FlightCard from './FlightCard';
import { Icon } from '@mui/material';
export default function Flights() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const handleBack=()=>{
    navigate('/book');
    
  }
  const flightName = state.flightData.flightName;
  const flightNumber = state.flightData.flightNumber;
  const availableSeats = state.flightData.availableSeats;
  const departureTime = state.flightData.departureTime;
  const arrivalTime = state.flightData.arrivalTime;
  const date = state.flightData.date;
  const price = state.flightData.price;
  return (
    <div className='bg-[#260F26] min-h-screen'>
      <div className='flex flex-row items-center justify-between px-2'>
        <h1 className='text-slate-50 text-[3rem] font-bold mx-[2rem]'>Flights from {state.flightData.fromDest} to {state.flightData.toDest}</h1>
        <span className="material-symbols-outlined text-slate-50 text-[3rem] mr-[1rem] hover:cursor-pointer" onClick={handleBack}>arrow_back</span>
      </div>
      <div className="flight-card-container w-full  flex flex-row flex-wrap justify-evenly">
      {flightNumber.map((number, index) => (
          <FlightCard
            key={index}
            flightName={flightName[index]}
            flightNumber={number}
            availableSeats={availableSeats[index]}
            departureTime={departureTime[index]}
            arrivalTime={arrivalTime[index]}
            date={date[index]}
            price={price[index]}
            trip={state.flightData.tripType}
            cabin={state.flightData.cabinClass}
            people={state.flightData.people}
          />
        ))}
      </div>
    </div>
  );
}
