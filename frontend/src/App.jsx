import { Route, Routes } from 'react-router-dom';

import Home from './pages/home/Home';
import SignUp from './pages/auth/SignUp/SignUp';
import Login from './pages/auth/Login/Login';
import RightPanel from './components/common/RightPanel';
import Notifications from './pages/notifications/Notifications';

import Sidebar from './components/common/Sidebar';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/profile/:username' element={<Profile />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;
