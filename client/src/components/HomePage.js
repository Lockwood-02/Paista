import React, { useState, useEffect } from 'react';
import axiosInstance from "../modules/axiosInstance";
import TopicComponent from './TopicComponent';

const HomePage = () => {
    const [data, setData] = useState([]);
    const [topics, setTopics] = useState([]);
    const [isTopicFormVisible, setIsTopicFormVisible] = useState(false); // State to manage the visibility of the topic form

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

    const handleToggleTopicForm = () => {
        setIsTopicFormVisible(!isTopicFormVisible); // Toggle the visibility of the topic form
    };

    return (
        <div>
            {/* Main Content */}
            <div className="">
                <div className="mb-4">
                    <h1 className="text-4xl font-medium font-header">Home</h1>
                </div>
                <div className=''>
                    {/* Render topics using the TopicComponent */}
                    <TopicComponent />
                </div>
            </div>
        </div>
    );
};

export default HomePage;