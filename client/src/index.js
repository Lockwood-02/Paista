import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import HomePage from './components/HomePage';
import DevTest from './components/DevTest';
import Signup from './components/Signup';
import Login from './components/Login';
import SessionTest from './components/SessionTest';
import FormComponent from './components/FormComponent';
import TopicComponent from './components/TopicComponent';

//import {HomePage, DevTest, Signup, Login} from './components/';

//React Router
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "devTest",
    element: <DevTest />
  },
  {
    path: "signup",
    element: <Signup />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "sessionTest",
    element: <SessionTest />
  },
  {
    path: "createTopic", 
    element: <FormComponent />
  },
  {
    path: "topics", 
    element: <TopicComponent /> 
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
