import axios from 'axios';
import React,{useState} from 'react';
import Reg from '../assets/register-image.png';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [mob,setMob] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const handleLoginClick = ()=>{
    navigate('/login');
  }
  const handleRegister = async () => {
    let name = firstName + ' ' + lastName;
    if (password !== confirmPassword) {
      alert("Passwords don't match");
    } else if (!name || !email || !password || !confirmPassword) {
      alert("Enter all fields");
    } else {
      const body = {
        email: email,
        password: password,
        mobile:mob,
        name: name
      };
      await axios.post('http://localhost:9000/register_user', body)
        .then(res => {
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFirstName('');
          setLastName('');
          setMob('');
          alert("User Registered Successfully");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  return (
    <div>
      <main className="container flex flex-col lg:flex-row ">
        <section className="image-section flex justify-center items-center bg-[#003049] w-screen lg:w-[30rem] lg:h-screen">
            <img src={Reg} alt="Register Image"/>
        </section>
        <section className="form-section p-[5rem]">
          <h1 className="form-title text-[2.5rem] font-semibold mb-[2rem]">Register</h1>
          <div className="form flex items-center flex-col gap-[2rem]">
            <div className="field-pair-1 flex flex-wrap gap-[2rem] my-[1rem]">
              <input type="text" name="First_Name" placeholder="First Name" id="first_name" className="bg-[transparent] outline-none border-b-4 border-[#780000] text-[1.3rem] px-2" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
              <input type="text" name="Last_Name" placeholder="Last Name" id="last_name" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2" value={lastName} onChange={(e) => { setLastName(e.target.value) }}/>
            </div>
            <div className="field-pair-2 flex flex-wrap gap-[2rem] my-[1rem]">
              <input type="email" name="Email" placeholder="Email" id="email" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
              <input type="tel" name="Mobile" placeholder="Mobile No." id="mob" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2" value={mob} onChange={(e) => { setMob(e.target.value) }} />
            </div>
            <div className="field-pair-3 flex flex-wrap gap-[2rem] my-[1rem]">
              <input type="password" name="Password" placeholder="Password" id="password" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2" value={password} onChange={(e) => { setPassword(e.target.value) }} />
              <input type="password" name="Confirm_Password" placeholder="Confirm Your Password" id="confirm_password" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
            </div>
          </div>
          <button className="text-[1.5rem] text-slate-200 my-[2rem] bg-[#780000] px-[3.5rem] py-[0.5rem] hover:text-black hover:bg-[#c1121f] rounded-full" id="register" onClick={handleRegister}>Register</button>
          <p className="text-[1.3rem] mt-[2rem] ">Already a user? <span className="underline font-medium cursor-pointer" onClick={handleLoginClick}>Login</span></p>
        </section>
      </main>
    </div>
  )
}
