import React, {useState} from 'react';
import axiosInstance from '../modules/axiosInstance';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        //can add client side validation for more responsiveness
        if(!username || !password){
            alert("Please enter a username and password");
            return;
        }

        try{
            const res = await axiosInstance.post("api/login", {
                username: username,
                password: password
            });
            console.log(res.data);//debugging
            //sends user to the home page
            nav('/');
        } catch (err){
            console.error('Error loging in user: ', err);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br></br>
                
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="hashedPassword" value={password} onChange={(e) => setPassword(e.target.value)} required /><br></br>
                <button type="submit">Login</button>
            </form>
        </div>
    );

};

export default Login;