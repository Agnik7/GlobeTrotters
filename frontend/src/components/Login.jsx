import axios from 'axios';
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Log from '../assets/login-image.png';
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleRegisterClick = ()=>{
    navigate('/register');
  }
  const handleLogin = async()=>{
    const body = {
        email: email,
        password: password
    }
    await axios.post('http://localhost:9000/login_user', body)
    .then((res)=>{
        alert("User logged in succesfully");
        localStorage.setItem('token', res.data.token);
        navigate('/book');
    })
    .catch(err=>{
        console.log(err)
    });
}

  return (
    <div>
      <main className="container flex flex-col lg:flex-row ">
          <section className="image-section flex justify-center items-center bg-[#780000] w-screen lg:w-[30rem] lg:h-screen">
              <img src={Log} alt="Login Image"/>
          </section>
          <section className="form-section p-[5rem] lg:mx-[3rem]">
              <h1 className="form-title text-[3rem] font-medium mb-[2rem]">Login</h1>
              <div className="form flex items-center flex-col gap-[3rem]">
                  <input type="email" name="Email" placeholder="Email" id="email" className="bg-[transparent] border-b-4 outline-none border-[#003049] text-[1.3rem] px-2"value={email} onChange={(e) => { setEmail(e.target.value) }}/>
                  <input type="password" name="Password" placeholder="Password" id="password" className="bg-[transparent] border-b-4 outline-none border-[#003049] text-[1.3rem] px-2" value={password} onChange={(e) => { setPassword(e.target.value) }}/>
                  <div className='w-full'>
                    <p className='bg-[transparent] text-[1.2rem] text-end font-medium cursor-pointer underline' onClick={()=>{navigate('/forgot')}}>Forgot Password?</p>                    
                  </div>
                  <button className="text-[1.5rem] text-slate-200 bg-[#003049] px-[3.5rem] py-[0.5rem] hover:text-black hover:bg-[#669bbc] rounded-full" id="login_button" onClick={handleLogin}>Login</button>
                  <p className="text-[1.3rem]">Not a user? <span className="underline font-medium cursor-pointer" onClick={handleRegisterClick}>Register</span></p>
              </div>

          </section>
      </main>
    </div>
  )
}
