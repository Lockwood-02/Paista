// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import Post from './Post';
import Topics from './Topics';
import postData from './postData';
import axiosInstance from "../modules/axiosInstance";

const HomePage = () => {
    const [data, setData] = useState([]);
    const [topics, setTopics] = useState([]);

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

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                // Fetch topics from the database
                const res = await axiosInstance.get("/api/topics");
                console.log("Got the topics: ", res.data);
                setTopics(res.data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
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
                    {topics.map((topic) => (
                    <Topics key={topic.id} title={topic.title} description={topic.description} author={topic.userID} />
                ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
