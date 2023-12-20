import axios from 'axios';
import React,{useState} from 'react';
import Reg from '../assets/register-image.png';
import { useNavigate } from 'react-router-dom';

export default function Forgot() {
    const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const handleLoginClick = ()=>{
    navigate('/login');
  }
  const handleReset= async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
    } else if (!email || !password || !confirmPassword) {
      alert("Enter all fields");
    } else {
      const body = {
        email: email,
        new_password: password,
      };
      await axios.post('http://localhost:9000/forgot_password', body)
        .then(res => {
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          alert(res.data.message);
          navigate('/login');
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
          <h1 className="form-title text-[2.5rem] font-semibold mb-[2rem]">Reset Password</h1>
          <div className="form flex items-center flex-col gap-[2rem]">
            <div className="field-pair-2 flex flex-wrap gap-[2rem] my-[1rem]">
              <input type="email" name="Email" placeholder="Email" id="new_email" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
            </div>
            <div className="field-pair-3 flex flex-col gap-[2rem]">
              <input type="password" name="Password" placeholder="New Password" id="new_password" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2 my-[1rem]" value={password} onChange={(e) => { setPassword(e.target.value) }} />
              <input type="password" name="Confirmed_Password" placeholder="Confirm Your Password" id="confirm_password" className="bg-[transparent] border-b-4 outline-none border-[#780000] text-[1.3rem] px-2 my-[1rem]" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
            </div>
          </div>
          <button className="text-[1.5rem] text-slate-200 my-[2rem] bg-[#780000] px-[3.5rem] py-[0.5rem] hover:text-black hover:bg-[#c1121f] rounded-full" id="reset" onClick={handleReset}>Reset</button>
          <p className="text-[1.3rem] mt-[2rem] ">Already a user? <span className="underline font-medium cursor-pointer" onClick={handleLoginClick}>Login</span></p>
        </section>
      </main>
    </div>
  )
}
