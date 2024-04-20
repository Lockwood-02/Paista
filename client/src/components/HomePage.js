// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import Post from './Post';
import postData from './postData';
import logo from '../PiastaFigma.png';
import avatar from '../blankPFPRound.png';
import axiosInstance from "../modules/axiosInstance";

const HomePage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("api/getUser");
                setData(res.data);
                console.log(data);//debug
            } catch (err) {
                console.error('Error fetching username: ', err);
            }
        };

        fetchData();

        return () => {
            //cancel requests or do cleanup
        };

    }, []);

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/api/logout'); // Make a POST request to the logout endpoint
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    return (
        <div className="flex">
            {/* Sidebar (Left) */}
            <div className="w-1/4 bg-back p-4">
                <div className="flex items-center mb-4">
                    <img src={logo} alt="Logo" className="mr-2 w-32 h-32" />
                    <h1 className="text-4xl font-medium mb-4 mt-8 font-header">Paista</h1>
                </div>
                <div className='ml-8'>
                    <div className='flex items-center mb-4'>
                        <img src={avatar} alt="Logo" className="mr-2 w-8 h-8" />
                        <p className="mb-2 cursor-pointer mt-2">
                            {data.username}
                        </p> {/* Put Username here */}
                    </div>
                    <ul>
                        <li className="mb-2 cursor-pointer">Help</li>
                    </ul>
                </div>
                {/* Logout button */}
                <div className='p-4'>
                    <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded mt-4 self-start">Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-1/2 p-4 pt-[68px]">
                <div className="mb-4">
                    <h1 className="text-4xl font-medium font-header">Home</h1>
                </div>
                <div >
                    {/* Render posts using the Post component */}
                    {postData.map((post, index) => (
                        <Post key={index} course={post.course} title={post.title} description={post.description} />
                    ))}
                </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="w-1/4 bg-back p-4 pt-[68px]">
                <h1 className="text-4xl font-medium mb-4 font-header">Courses</h1>
                <ul>
                    <li className="mb-2 text-green-500 cursor-pointer">CS 560</li>
                    <li className="mb-2 text-green-500 cursor-pointer">CS 570</li>
                </ul>
            </div>
        </div>
    );
};

export default HomePage;
