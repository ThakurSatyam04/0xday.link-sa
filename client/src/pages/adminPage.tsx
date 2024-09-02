import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// Rename FormData interface to avoid confusion with FormData object
interface UserFormData {
  username: string;
  bio: string;
  linkedInId: string;
  githubId: string;
  instaId: string;
  xId: string;
  fbId: string;
}

const AdminPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserFormData>();
  const [message, setMessage] = useState<string | null>(null);
  const [dpFile, setDpFile] = useState<File | null>(null); // Separate state for file

  useEffect(() => {
    if (username) {
      // Fetch existing user data if a username is provided
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${username}`);
          const userData = response.data;

          // Set the form fields with the existing user data
          setValue('username', userData.username);
          setValue('bio', userData.bio);
          setValue('linkedInId', userData.linkedInId);
          setValue('githubId', userData.githubId);
          setValue('instaId', userData.instaId);
          setValue('xId', userData.xId);
          setValue('fbId', userData.fbId);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setMessage('Failed to load user data.');
        }
      };

      fetchUserData();
    }
  }, [username, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const formData = new FormData();

      if (dpFile) {
        formData.append('dp', dpFile);
      }

      // Append the rest of the form fields to the FormData
      formData.append('username', data.username);
      formData.append('bio', data.bio);
      formData.append('linkedInId', data.linkedInId);
      formData.append('githubId', data.githubId);
      formData.append('instaId', data.instaId);
      formData.append('xId', data.xId);
      formData.append('fbId', data.fbId);

      let response;
      if (username) {
        // Update existing user
        const token = localStorage.getItem("token");
        response = await axios.put(`/api/admin/update-user/${username}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'admin-auth':token,
          },
        });
      } else {
        // Add new user
        const token = localStorage.getItem("token");
        response = await axios.post('/api/admin/add-user', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'admin-auth':token,
          },
        });
      }

      console.log('Updated FormData:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

      if (response.status === 201 || response.status === 200) {
        setMessage('User data saved successfully!');
        reset(); // Reset form after successful submission
        setDpFile(null); // Reset file input
      } else {
        setMessage('Failed to save user data.');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to save user data.';
      setMessage(errorMsg);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#012401] p-4">
      <Card className="w-full max-w-lg bg-[#5fef5f9c] shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {username ? `Edit User: ${username}` : 'Admin - Add User Data'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="dp">Upload DP</Label>
              <Input
                className="mt-2 font-semibold"
                type="file"
                id="dp"
                onChange={(e) => {
                  if (e.target.files) {
                    setDpFile(e.target.files[0]);
                  }
                }}
              />
              {/* {errors && <p className="text-red-500 text-sm mt-1">Already uploaded, add updated dp is needed...</p>} */}
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                className="mt-2 font-semibold"
                type="text"
                id="username"
                {...register('username', { required: 'Username is required' })}
                disabled={!!username} // Disable username field when editing
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                className="mt-2 font-semibold"
                type="text"
                id="bio"
                {...register('bio', { required: 'Bio is required' })}
              />
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
            </div>
            <div>
              <Label htmlFor="linkedInId">LinkedIn ID</Label>
              <Input
                className="mt-2 font-semibold"
                type="text"
                id="linkedInId"
                {...register('linkedInId', { required: 'LinkedIn ID is required' })}
              />
              {errors.linkedInId && <p className="text-red-500 text-sm mt-1">{errors.linkedInId.message}</p>}
            </div>
            <div>
              <Label htmlFor="githubId">GitHub ID</Label>
              <Input
                className="mt-2 font-semibold"
                type="text"
                id="githubId"
                {...register('githubId', { required: 'GitHub ID is required' })}
              />
              {errors.githubId && <p className="text-red-500 text-sm mt-1">{errors.githubId.message}</p>}
            </div>
            <div>
              <Label htmlFor="instaId">Instagram ID</Label>
              <Input
                className="mt-2 font-semibold"
                type="text"
                id="instaId"
                {...register('instaId', { required: 'Instagram ID is required' })}
              />
              {errors.instaId && <p className="text-red-500 text-sm mt-1">{errors.instaId.message}</p>}
            </div>
            <div>
              <Label htmlFor="xId">X (formerly Twitter) ID</Label>
              <Input
                className="mt-2 font-semibold"
                type="text"
                id="xId"
                {...register('xId', { required: 'X ID is required' })}
              />
              {errors.xId && <p className="text-red-500 text-sm mt-1">{errors.xId.message}</p>}
            </div>
            <div>
              <Label htmlFor="fbId">Facebook ID</Label>
              <Input
                className="mt-2 font-semibold"
                type="text"
                id="fbId"
                {...register('fbId', { required: 'Facebook ID is required' })}
              />
              {errors.fbId && <p className="text-red-500 text-sm mt-1">{errors.fbId.message}</p>}
            </div>
            <CardFooter className="flex flex-col items-center">
              <Button type="submit" className="w-full">
                {username ? 'Update User Data' : 'Save User Data'}
              </Button>
              {message && (
                <p
                  className={`mt-2 ${
                    message.includes('successfully') ? 'text-white' : 'text-red-500'
                  }`}
                >
                  {message}
                </p>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
