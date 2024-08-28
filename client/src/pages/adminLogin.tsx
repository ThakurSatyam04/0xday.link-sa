import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import Shadcn Button
import { Input } from '@/components/ui/input'; // Import Shadcn Input

const AdminLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpcode, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
        const response = await axios.post('/api/send-otp', { phoneNumber });
        if (response.status === 200) {
          setIsOtpSent(true);
          alert('OTP sent successfully');
        } else {
          alert(response.data.error || 'Failed to send OTP');
        }
      } catch (error:any) {
        if (error.response && error.response.data) {
            alert(error.response.data.error || 'Failed to send OTP');
          } else {
            alert('An error occurred while sending OTP');
          }
      }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('/api/verify-otp', { phoneNumber, otpcode });
      if (response.status === 200 ) {
        // Store token and navigate on success
        localStorage.setItem('token', response.data.token);
        navigate('/admin-access');
      } else {
        // Handle cases where the response does not contain a token
        alert('Invalid OTP');
      }
    } catch (error: any) {
      // Check if the error response is from the server
      if (error.response && error.response.data) {
        alert(error.response.data.error || 'Invalid OTP');
      } else {
        alert('An error occurred while verifying OTP');
      }
    }
  };
  

  return (
    <div className='flex h-screen items-center justify-center text-3xl bg-[#012401]'>
      {!isOtpSent ? (
        <div className='flex flex-col items-center gap-5'>
          <h2 className='font-bold text-white'>Login as Admin</h2>
          <Input
          className='text-white'
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button className='bg-[#5ce5008e]' onClick={sendOtp}>Send OTP</Button>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-5'>
          <h2 className='font-bold text-white'>Enter the OTP</h2>
          <Input
          className='text-white'
            type="text"
            placeholder="Enter OTP"
            value={otpcode}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button className='bg-[#5ce5008e]' onClick={verifyOtp}>Verify OTP</Button>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
