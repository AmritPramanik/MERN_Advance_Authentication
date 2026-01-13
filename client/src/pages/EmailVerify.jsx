import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const {backendUrl,isLoggedin, userData} = useContext(AppContext)

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    const lastIndex = pasteArray.length - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  };

  const onSubmitHandler = async(e) =>{
    try{

      e.preventDefault();
      const otpArray = inputRefs.current.map(e=>e.value);
      const otp = otpArray.join('');
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl+'/api/auth/verify-account',{otp})

      if(data.success){
        toast.success(data.message)
        navigate('/')
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[userData,isLoggedin])

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form onSubmit={onSubmitHandler} 
      className="bg-slate-900 p-8 rounded-lg shadow-lg w-full sm:w-[400px] text-indigo-200 text-sm">
        <h1 className="text-2xl font-semibold text-white text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-small text-center mb-6">
          Enter the 6-degit code sent to your email id.
        </p>
        <div
          onPaste={handlePaste}
          className="flex justify-between mb-8 items-center"
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className=" h-12 w-12 rounded-md bg-[#333A5C] text-white text-center text-xl            outline-none border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer text-white font-medium"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
