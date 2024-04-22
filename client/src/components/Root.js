import React, { useState, useEffect } from 'react';
import logo from '../PiastaFigma.png';
import avatar from '../blankPFPRound.png';
import axiosInstance from "../modules/axiosInstance";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import TopicAdd from './TopicAdd'; // Import the TopicAdd component

const Root = () => {
    const [data, setData] = useState([]);
    const [showTopicAdd, setShowTopicAdd] = useState(false); // State to manage visibility of TopicAdd

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get("api/getUser");
            setData(res.data);
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

    //redirect
    const nav = useNavigate();

    const handleLogout = async (e) => {
        console.log("handling logout...")
        try{
            const res = await axiosInstance.get("api/logout");
            if(!res.error){
                console.log("You are logged out");
                fetchData();
                nav("/") //send logged out user to homepage
            }else{
                console.error("axios recieved an error logging out: ", res.error);
            }

        }catch(err){
            console.error("caught error logging out: ", err)
        }
    }

    const handleLogin = (e) => {
        //sends user to the login page
        nav("/login");
    }

    const handleAddTopic = () => {
        setShowTopicAdd(true); 
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar (Left) */}
            <div className="w-1/4 bg-back p-4">
                <Link className="flex items-center mb-4" to="/">
                    <img src={logo} alt="Logo" className="mr-2 w-32 h-32" />
                    <h1 className="text-4xl font-medium mb-4 mt-8 font-header">Paista</h1>
                </Link>
                <div className='ml-8'>
                    <div className='flex items-center mb-4'>
                        <Link to={"/profile/" + data.id}>
                            <img src={avatar} alt="Logo" className="mr-2 w-8 h-8" />
                            <p id="rootUsername" className="mb-2 cursor-pointer mt-2">
                                {data.username}
                            </p> {/* Put Username here */}
                        </Link>
                    </div>
                </div>
                    {data.id ? (
                        <div className='p-4'>
                            <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded mt-4 self-start">Logout</button>
                        </div>
                    ) : (
                        <div className='p-4'>
                            <button onClick={handleLogin} className="bg-blue-500 text-white py-2 px-4 rounded mt-4 self-start">Login</button>
                        </div>
                    )
                    }
                    </div>


            {/* Main Content */}
            <div className="w-1/2 p-4 pt-[68px]">
                <main>
                    <Outlet />
                </main>
                {/* <React.StrictMode>
                    <RouterProvider router={router} />
                </React.StrictMode> */}

                {showTopicAdd && (
                    <TopicAdd onClose={() => setShowTopicAdd(false)} /> 
                )}
            </div>


            {/* Sidebar (Right) */}
            <div className="w-1/4 bg-back p-4 pt-[68px]">
                <h1 className="text-4xl font-medium mb-4 font-header">Courses <button onClick={handleAddTopic} className="ml-2 bg-blue-500 text-white py-2 px-4 rounded">+</button></h1>
                
                <ul>
                    <li className="mb-2 text-green-500 cursor-pointer">CS 560</li>
                    <li className="mb-2 text-green-500 cursor-pointer">CS 570</li>
                </ul>
            </div>
        </div>

    );
};

export default Root;