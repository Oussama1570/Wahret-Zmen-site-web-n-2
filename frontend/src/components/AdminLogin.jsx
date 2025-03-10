import React, { useState } from 'react'
import { useForm } from "react-hook-form"

import axios from "axios"
import getBaseUrl from '../utils/baseURL'
import { useNavigate } from 'react-router-dom'
import "../Styles/StylesAdminLogin.css"

const AdminLogin = () => {
    const [message, setMessage] = useState("")
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

      const navigate = useNavigate()

      const onSubmit = async (data) => {
        // console.log(data)
        try {
           const response =  await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
           })
           const auth = response.data;
        //    console.log(auth)
            if(auth.token) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                    localStorage.removeItem('token')
                    alert('Token has been expired!, Please login again.');
                    navigate("/")
                }, 3600 * 1000)
            }

            alert("Admin Login successful!")
            navigate("/dashboard")

        } catch (error) {
            setMessage("Please provide a valid email and password") 
            console.error(error)
        }
      }
      return (
        <div className='admin-login-container'>
          <div className='admin-login-box'>
            <h2 className='admin-login-title'>Admin Dashboard Login</h2>
      
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                <input 
                  {...register("username", { required: true })} 
                  type="text" 
                  name="username" 
                  id="username" 
                  placeholder='Username'
                  className='input-field'
                />
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
              </div>
              {message && <p className='error-text'>{message}</p>}
      
              <button className='admin-login-button'>Login</button>
            </form>
      
            <p className='admin-footer-text'>©2025 Product Store. All rights reserved.</p>
          </div>
        </div>
      );
      
};

export default AdminLogin