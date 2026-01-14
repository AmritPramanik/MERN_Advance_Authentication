import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/appContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(0);
  const [isEmailSent, setIsEmailSent] = useState("");
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const inputRefs = React.useRef([]);

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otp = otpArray.join("");
    setIsOtpSubmited(true);
    setOtp(otp);
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, password }
      );

      if (data.success) {
        navigate("/login");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Email Enter form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-full sm:w-[400px] text-indigo-200 text-sm"
        >
          <h1 className="text-2xl font-semibold text-white text-center mb-2">
            Reset Password
          </h1>
          <p className="text-small text-center mb-8">
            Enter your registerd email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none "
              type="email"
              placeholder="Email id"
              required
            />
          </div>

          <button className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer text-white font-medium">
            Submit
          </button>
        </form>
      )}

      {/* OTP enter form*/}
      {isEmailSent && !isOtpSubmited && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-full sm:w-[400px] text-indigo-200 text-sm"
        >
          <h1 className="text-2xl font-semibold text-white text-center mb-4">
            Reset Password OTP
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

          <button className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer text-white font-medium">
            Submit
          </button>
        </form>
      )}

      {/* new passwerd */}
      {isEmailSent && isOtpSubmited && (
        <form
          onSubmit={onSubmitPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-full sm:w-[400px] text-indigo-200 text-sm"
        >
          <h1 className="text-2xl font-semibold text-white text-center mb-2">
            New Password
          </h1>
          <p className="text-small text-center mb-8">Enter your new password below</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none "
              type="password"
              placeholder="new password"
              required
            />
          </div>

          <button className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer text-white font-medium">
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
