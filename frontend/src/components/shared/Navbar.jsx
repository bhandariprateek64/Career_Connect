import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { USER_API_ENDPOINT } from '@/utils/constants';
import { setUser } from '@/redux/authSlice';
import axios from 'axios';

const Navbar = () => {
  const { user } = useSelector((store) => store.auth); // Change this to `true` to test the logged-in state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true, // Ensures cookies are sent
      });
      if (res.data.success) {
        dispatch(setUser(null)); // Clear user state
        navigate('/'); // Redirect to home page
        toast.success(res.data.message); // Show success toast
      }
    } catch (error) {
      console.log(error);

      // Use optional chaining and fallback message to handle undefined values
      const errorMessage =
        error?.response?.data?.message || 'Logout failed. Try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold">
              Career <span className="text-[#f83002]">Connect</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === 'recruiter' ? (
              <>
                <li>
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li>
                  {' '}
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                {' '}
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  {' '}
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li>
                  {' '}
                  <Link to="/browse">Browse</Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>

              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover: bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      'https://imgs.search.brave.com/k82fYyuT2CK_tkdTpJpv2PtvHVT1FcPS5OgFkeYuVbY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzQzLzM2LzU3/LzM2MF9GXzk0MzM2/NTcxN19IMEduZmVZ/ajA3ZDRvVjF4UHo4/V0hTWmdjdmdGb1pk/Vy5qcGc'
                    }
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-2 space-y-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        'https://imgs.search.brave.com/k82fYyuT2CK_tkdTpJpv2PtvHVT1FcPS5OgFkeYuVbY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzQzLzM2LzU3/LzM2MF9GXzk0MzM2/NTcxN19IMEduZmVZ/ajA3ZDRvVjF4UHo4/V0hTWmdjdmdGb1pk/Vy5qcGc'
                      }
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullName}</h4>
                    <p className="text-small text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-gray-600">
                  {user && user.role === 'student' && (
                    <div className="flex items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View profile</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
