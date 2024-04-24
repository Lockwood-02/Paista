import React, { useState, useEffect } from 'react';
import {createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements, } from "react-router-dom";
import axiosInstance from "./modules/axiosInstance";
import './index.css';
// import App from './App';

import HomePage from './components/HomePage';
import Root from './components/Root';
import Signup from './components/Signup';
import Login from './components/Login';
import CreatePost from './components/Post/CreatePost';
import EditPost from './components/Post/EditPost';
import TopicAdd from './components/TopicAdd';
import ViewPost from './components/Post/ViewPost';
import TopicComponent from './components/TopicComponent';
import Admin from './components/Admin/Admin';
import AdminUsers from './components/Admin/AdminUsers';
import AdminPosts from './components/Admin/AdminPosts';
import Profile from './components/Profile';
import TopicPage from './components/TopicPage';


function App() {
  const [user, setUser] = useState({});

  const fetchData = async () => {
    try {
        const res = await axiosInstance.get("api/getUser");
        setUser(res.data);
    } catch (err) {
        console.error('Error fetching username: ', err);
    }
};

useEffect(() => {
    fetchData();

    return () => {
        //cancel requests or do cleanup
    };

  }, []);
  

  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route
      path='/*'
      element={(
        <>
            <Routes>
              <Route path="signup" element={<Signup />} />
              <Route path='login' element={<Login />} />
              <Route path='*' element={<Root />} >
                <Route index element={<HomePage />} />
                <Route path='createPost' element={<CreatePost user={user}/>} />
                <Route path='editPost' element={<EditPost user={user}/>} />
                <Route path='topics' element={<TopicAdd />} />
                <Route path='topics/:topicId' element={<TopicPage />}/>
                <Route path='viewPost' element={<ViewPost user={user}/>} />
                <Route path='TopicComponent' element={<TopicComponent />} />
                <Route path='Admin' element={<Admin user={user}/>} />
                <Route path='Admin/users/:dataId' element={<AdminUsers user={user}/>} />
                <Route path='Admin/posts/:dataId' element={<AdminPosts user={user}/>} />
                <Route path='profile/:dataId' element={<Profile user={user}/>} />
              </Route>
              
            </Routes>
        </>
      )}
    />
  
    )
  
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App;