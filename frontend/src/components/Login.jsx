import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';
import "../Styles/StylesLogin.css";

const Login = () => {
  const [message, setMessage] = useState("");
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      alert("Login successful!"); // Success Alert
      navigate("/");
    } catch (error) {
      setMessage("Please provide a valid email and password");
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Login successful!"); // Success Alert
      navigate("/");
    } catch (error) {
      setMessage("Google sign-in failed!");
      console.error(error);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2 className='login-title'>Please Login</h2>

        {message && <p className="error-text text-red-500 mb-3">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              placeholder='Email Address'
              className='input-field'
            />
            {errors.email && <p className='error-text'>Email is required.</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder='Password'
              className='input-field'
            />
            {errors.password && <p className='error-text'>Password is required.</p>}
          </div>

          <button className='login-button'>Login</button>
        </form>

        <p className='align-baseline font-medium mt-4 text-sm'>
          Haven't an account? Please <Link to="/register" className='text-blue-500 hover:text-blue-700'>Register</Link>
        </p>

        {/* Google Sign In */}
        <button onClick={handleGoogleSignIn} className='google-button'>
          <FaGoogle className='mr-2' />
          Sign in with Google
        </button>

        <p className='footer-text'>©2025 Product Store. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
