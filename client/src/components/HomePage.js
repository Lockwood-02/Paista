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


    return (

        <div>
            {/* Main Content */}
            <div className="">
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
        </div>
    );
};

export default HomePage;
