import React, { useState } from "react";
import axiosInstance from "../modules/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    //can add client side validation for more responsiveness
    if (!username || !password) {
      alert("Please enter a username and password");
      return;
    }

    try {
      const res = await axiosInstance.post("api/login", {
        username: username,
        password: password,
      });
      console.log(res.data); //debugging
      //sends user to the home page
      nav("/");
    } catch (err) {
      console.error("Error logging in user: ", err);
    }
  };

  return (
    // <div>
    //     <h1>Login</h1>
    //     <form onSubmit={handleLogin}>
    //         <label htmlFor="username">Username:</label>
    //         <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br></br>

    //         <label htmlFor="password">Password:</label>
    //         <input type="password" id="password" name="hashedPassword" value={password} onChange={(e) => setPassword(e.target.value)} required /><br></br>
    //         <button type="submit">Login</button>
    //     </form>
    // </div>

    <div className="bg-back flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="hashedPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            id="loginButton"
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
        <Link to='/signup'>
          No account? Singup here!
        </Link>
      </div>
    </div>
  );
};

export default Login;
