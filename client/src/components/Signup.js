import React, {useState} from 'react';
import axiosInstance from '../modules/axiosInstance';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const nav = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        //mild client side validation
        if(!username || !password || !firstName || !lastName || !email){
            alert("Please complete all feilds");
            return;
        }

        try{
            const res = await axiosInstance.post("api/signup", {
                username:username,
                password:password,
                email:email,
                firstName:firstName,
                lastName:lastName
            });
            console.log(res.data);//debugging
            if(res.data.error){
                setMessage(res.data.error)
            }else{
                try{
                    const login = await axiosInstance.post("api/login", {
                        username:username,
                    password:password
                    });
                    if(login.status === 200){
                        console.log("successful login", login.data)
                        nav('/');
                    }else{
                        console.log("login unsuccessful, rerouting to manual", login.data)
                        nav('/login')
                    }
                }catch(err){
                    nav('/login')
                }
            }
        } catch (err){
            console.error('Error signing up user: ', err);
            setMessage(err.error);
        }
    }

    return (
        <div className="bg-back flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block">Username:</label>
                        <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block">Password:</label>
                        <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block">Email:</label>
                        <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block">First Name:</label>
                        <input type="text" id="firstName" name="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <button id='signupButton' type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign up</button>
                </form>
                <p className='text-red-500 font-bold'>
                    {message}
                </p>
            </div>
        </div>

    )
}

export default Signup;