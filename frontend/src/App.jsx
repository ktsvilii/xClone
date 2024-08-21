import { Navigate, Route, Routes } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Home from './pages/home/Home';
import SignUp from './pages/auth/SignUp/SignUp';
import Login from './pages/auth/Login/Login';
import Notifications from './pages/notifications/Notifications';
import Profile from './pages/profile/Profile';

import RightPanel from './components/common/RightPanel';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}

      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/notifications' element={authUser ? <Notifications /> : <Navigate to='/login' />} />
        <Route path='/profile/:username' element={authUser ? <Profile /> : <Navigate to='/login' />} />
      </Routes>

      {authUser && <RightPanel />}

      <Toaster />
    </div>
  );
}

export default App;
