import React, { useState, useEffect } from 'react';
import logo from '../PiastaFigma.png';
import avatar from '../blankPFPRound.png';
import axiosInstance from "../modules/axiosInstance";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import TopicAdd from './TopicAdd'; // Import the TopicAdd component

const Root = () => {
    const [data, setData] = useState([]);
    const [showTopicAdd, setShowTopicAdd] = useState(false); // State to manage visibility of TopicAdd
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axiosInstance.get('/api/topics');
                setTopics(response.data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get("api/getUser");
            console.log("Root setting user: ", res.data);
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
        try {
            const res = await axiosInstance.get("api/logout");
            if (!res.error) {
                console.log("You are logged out");
                fetchData();
                nav("/") //send logged out user to homepage
            } else {
                console.error("axios recieved an error logging out: ", res.error);
            }

        } catch (err) {
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
            <div className="w-1/4 bg-back p-4 flex flex-col flex-grow">
                <div className="rounded-3xl bg-[#D9D9D9] p-2 pr-8 mb-4 shadow-lg">
                    <Link className="flex items-center" to="/">
                        <img src={logo} alt="Logo" className="mr-2 w-32 h-32 rounded-full" />
                        <h1 className="text-4xl font-medium font-header">Paista</h1>
                    </Link>
                </div>
                <div className="flex flex-col rounded-3xl bg-[#D9D9D9] p-10 flex-grow">
                    <ul>
                        <li>
                            <Link to={"/profile/" + data.id} className="flex items-center">
                                <img src={avatar} alt="Avatar" className="mr-2 w-12 h-12 rounded-full" />
                                <p id="rootUsername" className="mb-2 cursor-pointer mt-2 text-xl">
                                    {data.username}
                                </p>
                            </Link>
                        </li>
                        <li className='cursor-pointer mt-2 text-xl'>
                            <Link to={"/"} className='flex items-center'>
                                <p>Home</p>
                            </Link>
                        </li>
                        <li className='cursor-pointer mt-2 text-xl'>
                            <Link to={"/admin"} className='flex items-center'>
                                <p>Admin Panel</p>
                            </Link>
                        </li>
                    </ul>
                    <div className="mt-auto">
                        {data.id ? (
                            <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">Logout</button>
                        ) : (
                            <button onClick={handleLogin} className="bg-blue-500 text-white py-2 px-4 rounded">Login</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-1/2 p-4 pt-[68px] overflow-y-auto">
                <main>
                    <Outlet user={data} />
                </main>
                {showTopicAdd && (
                    <TopicAdd onClose={() => setShowTopicAdd(false)} />
                )}
            </div>

            {/* Sidebar (Right) */}
            <div className="w-1/4 bg-back p-4 flex flex-col">
                <div className="rounded-3xl bg-[#D9D9D9] p-2 pr-8 mb-4 shadow-lg items-center justify-center py-11">
                    <h1 className="text-4xl font-medium font-header ml-4"><button onClick={handleAddTopic} className="ml-2 bg-stone-400 text-white py-2 px-4 rounded mr-4">+</button>Topics </h1>
                </div>
                <div className='flex flex-col rounded-3xl bg-[#D9D9D9] p-10 flex-grow'>
                    <h2 className="text-xl font-bold mb-2">Current Topics</h2>
                    <ul className='text-xl'>
                        {topics.map((topic) => (
                            <li key={topic.id}>{topic.title}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>


    );
};

export default Root;