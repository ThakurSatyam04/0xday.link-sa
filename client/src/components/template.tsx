import React, { useState } from 'react';
import { FaInstagram, FaLinkedin, FaFacebook, FaGithub, FaUser } from 'react-icons/fa';
import { default as TwitterXIcon } from '../twitter-x.svg';

interface TemplateProps {
  data: any;
}

const Template: React.FC<TemplateProps> = ({ data }) => {
  const [showPopup, setShowPopup] = useState(true);
  
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <>
    <div className="relative min-h-screen flex flex-col items-center text-white" style={{ backgroundColor: '#012401' }}>
      {/* Content Section */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 lg:px-8">
        {/* Profile Image */}
        <img
          src={data.image} // Use data.image here for profile image
          alt="Profile"
          className="w-36 h-36 lg:w-36 lg:h-36 rounded-full mx-auto mb-4 shadow-lg"
        />
        
        {/* Bio Section */}
        <h1 className="text-white text-md sm:text-md lg:text-xl font-bold mb-8 text-center">
          {data.bio}
          <span className="block mt-2">
            🌐 Tech Conferences | 📹 Webinars | 👨‍💻 Hackathons
          </span>
          <span className='block mt-2'>
            Skill Protocol - <a href="https://skillprotocol.com/" target='_blank' className="text-[#2f89f7] hover:underline">SkillProtocol.com</a>
          </span>
        </h1>

        {/* Social Media Links */}
        <div className="flex flex-col w-full lg:w-1/1 space-y-4">
          <a href={`https://www.instagram.com/${data.instaId}`} target='_blank' rel="noopener noreferrer" className="w-full py-3 px-4 border border-white rounded-full flex items-center justify-center text-lg hover:bg-red-300 hover:text-white transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <FaInstagram className="mr-2" /> Instagram
          </a>
          <a href={`https://www.linkedin.com/company/${data.linkedInId}`} target='_blank' rel="noopener noreferrer" className="w-full py-3 px-4 border border-white rounded-full flex items-center justify-center text-lg hover:bg-blue-300 hover:text-white transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <FaLinkedin className="mr-2" /> LinkedIn
          </a>
          <a href={`https://twitter.com/${data.xId}`} target='_blank' rel="noopener noreferrer" className="w-full py-3 px-4 border border-white rounded-full flex items-center justify-center text-lg hover:bg-gray-300 hover:text-white transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <img className='mr-2 h-4 w-4 font-white bg-white' src={TwitterXIcon} alt="" /> X
          </a>
          <a href={`https://www.facebook.com/${data.fbId}`} target='_blank' rel="noopener noreferrer" className="w-full py-3 px-4 border border-white rounded-full flex items-center justify-center text-lg hover:bg-blue-400 hover:text-white transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <FaFacebook className="mr-2" /> Facebook
          </a>
          <a href={`https://github.com/${data.githubId}`} target='_blank' rel="noopener noreferrer" className="w-full py-3 px-4 border border-white rounded-full flex items-center justify-center text-lg hover:bg-gray-400 hover:text-white transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <FaGithub className="mr-2" /> GitHub
          </a>
        </div>
      </div>
    </div>

    {showPopup && (
      <div className="hidden lg:block fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-30">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaUser className="text-xl mr-2" />
            <span>Create your <strong>0xDay</strong> 0xprofile now!</span>
          </div>
          <button onClick={handleClosePopup} className="ml-4 text-gray-400 hover:text-white">&times;</button>
        </div>
        <a href="https://0xprofile.com/" target='_blank' className="mt-2 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
          Create Profile
        </a>
      </div>
    )}

    {/* Icon for small screens */}
    <div className="block lg:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg z-30">
      <a href="https://0xprofile.com/" target='_blank' className="text-white">
        <FaUser className="text-2xl" />
      </a>
    </div>
    </>
  );
};

export default Template;
