// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import Post from './Post';
import postData from './postData';
import logo from '../PiastaFigma.png';
import avatar from '../blankPFPRound.png';
import axiosInstance from "../modules/axiosInstance";

const HomePage = () => {
    const [data, setData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Search functions 
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("api/getUser");
                setData(res.data);
                console.log(data);//debug

                // Check if the username is "not logged in"
                if (res.data.username === "not logged in") {
                    setIsLoggedIn(false); // Set isLoggedIn to false if username is "not logged in"
                }
            } catch (err) {
                console.error('Error fetching username: ', err);
                setIsLoggedIn(false);
                // console.log("not logged in");
            }
        };

        fetchData();

        return () => {
            //cancel requests or do cleanup
        };

    }, []);

    // For searching
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const res = await axiosInstance.get(`/api/topics?query=${searchQuery}`);
                setSearchResults(res.data);
            } catch (error) {
                console.error('Error searching topics:', error);
            }
        };

        if (searchQuery !== '') {
            fetchSearchResults();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);


    // Logout section
    const handleLogout = async () => {
        try {
            await axiosInstance.post("api/logout");
            // Redirect to login page
            window.location.reload(); // For simplicity, reload the page after logout
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    const handleUsernameClick = () => {
        if (!isLoggedIn) {
            window.location.href = "/login"; // Redirect to login page if not logged in
        }
        console.log("clicked");
    };

    const handleSearchSubmit = () => {
        // Fetch search results when search button is clicked
        if (searchQuery.trim() !== '') {
            setSearchResults([]); // Clear previous search results
            setSearchQuery(searchQuery.trim());
        }
    };

    // This makes it so if the user is not logged in they cannot view any page
    // if (!isLoggedIn) { // Redirect to login page if user is not logged in
    //     console.log("not logged in");
    //     window.location.href = "/login";
    // }


    return (
        <div className="flex h-screen">
            {/* Sidebar (Left) */}
            <div className="w-1/4 bg-back p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-4">
                        <img src={logo} alt="Logo" className="mr-2 w-32 h-32" />
                        <h1 className="text-4xl font-medium mb-4 mt-8 font-header">Paista</h1>
                    </div>
                    <div className='ml-8'>
                        <div className='flex items-center mb-4'>
                            <img src={avatar} alt="Logo" className="mr-2 w-8 h-8" />
                            <p className="mb-2 cursor-pointer mt-2" onClick={handleUsernameClick}>
                                {data.username}
                            </p>
                        </div>
                        <ul>
                            <li className="mb-2 cursor-pointer">Help</li>
                        </ul>
                    </div>
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
                {/* Search bar */}
                <div className="w-full p-4 flex justify-between">
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border rounded px-4 py-2"
                    />
                    <button
                        onClick={handleSearchSubmit}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Search
                    </button>
                </div>
                <div >
                    {/* Render posts using the Post component */}
                    {postData.map((post, index) => (
                        <Post key={index} course={post.course} title={post.title} description={post.description} />
                    ))}
                </div>

                {/* Render search results (FOR WHEN WE GET THIS SETUP) */}
                {/* <div className="w-full p-4">
                    {searchResults.map(topic => (
                        <div key={topic.id}>
                            <h2>{topic.title}</h2>
                            <p>{topic.description}</p>
                        </div>
                    ))}
                </div> */}
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
