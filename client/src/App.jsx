import React from 'react';
import {createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements} from "react-router-dom";

import './index.css';
// import App from './App';

import HomePage from './components/HomePage';
import Root from './components/Root';
import SessionTest from './components/SessionTest';
import Signup from './components/Signup';
import Login from './components/Login';
import CreatePost from './components/Post/CreatePost';
import EditPost from './components/Post/EditPost';

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
              <Route path='sessionTest' element={<SessionTest />} />
              <Route path='createPost' element={<CreatePost />} />
              <Route path='editPost' element={<EditPost />} />
            </Route>
          </Routes>
      </>
    )}
  />

  )

)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;