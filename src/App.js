import React from 'react';
import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword, MessagerieView } from "./pages";
import { SocketProvider } from './context/SocketContext';

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
      <Outlet />
  ) : (
      <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
      <SocketProvider>
        <div data-theme={theme} className='w-full min-h-[100vh]'>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path='/profile/:id?' element={<Profile />} />
            </Route>

            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path="/messagerie" element={<MessagerieView />} />
          </Routes>
        </div>
      </SocketProvider>
  );
}

export default App;
