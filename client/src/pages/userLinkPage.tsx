import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Template from '../components/template';
import axios from 'axios';

const UserTemplate: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const resolvedUsername = username || "0xday";

  useEffect(()=>{
    const fetchUserData = async()=>{
      try {
        const response = await axios.get(`/api/user/${resolvedUsername}`);
        setUserData(response.data);
      } catch (error) {
        console.log("Error in fetching userdata in userLinkPage")
      } finally {
        setLoading(false);
      }
    };

    fetchUserData()
  }, [username]);

  return userData ? (<Template data={userData} />): 
  (<div className='w-screen h-screen flex items-center justify-center text-4xl font-bold bg-[#012401] text-white'>User not found</div>);
};

export default UserTemplate;
