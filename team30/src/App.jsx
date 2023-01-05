import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import AppLayout from './AppLayout';
import Profile from './Pages/Profile';
import Follow from './Pages/Follow';
import Activity from './Pages/Activity';
import Signup from './Pages/Signup';
// import './main.css';
import CreatePost from './Pages/CreatePost';
import PostDetail from './Pages/PostDetail';
import Login from './Pages/Login';
import EditPost from './Pages/EditPost';

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/post" element={<CreatePost />} />
      <Route path="/follow" element={<Follow />} />
      <Route exact path="/user/:userid" element={<Activity />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/EditPost/:id" element={<EditPost />} />
    </Routes>
  );
}

export default App;
