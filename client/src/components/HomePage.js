import React, { useState, useEffect } from 'react';
import logo from '../PiastaFigma.png';
import avatar from '../blankPFPRound.png';
import axiosInstance from '../modules/axiosInstance';
import TopicComponent from './TopicComponent';

const HomePage = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("api/getUser");
                setData(res.data);
            } catch (err) {
                console.error('Error fetching username: ', err);
            }
        };

        fetchData();

        return () => {
            // Cleanup
        };
    }, []);

    // Function to handle form close
    const handleCloseForm = () => {
        setShowForm(false);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            title: formTitle,
            description: formDescription
        };
        try {
            await axiosInstance.post("/api/topics", formData);
            setFormTitle(''); // Reset form fields after submission
            setFormDescription('');
            setShowForm(false); // Close the form after successful submission
        } catch (error) {
            console.error('Error creating topic:', error);
            // Handle error
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
                        </p>
                    </div>
                    <ul>
                        <li className="mb-2 cursor-pointer">Help</li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-1/2 p-4 pt-[68px]">
                <div className="mb-4">
                    <h1 className="text-4xl font-medium font-header">Home</h1>
                </div>
                <TopicComponent />
                {/* Render form */}
                {showForm && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-4">Create New Topic</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block font-medium">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block font-medium">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full h-24"
                                ></textarea>
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
                                <button type="button" onClick={handleCloseForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Sidebar (Right) */}
            <div className="w-1/4 bg-back p-4 pt-[68px]">
                <h1 className="text-4xl font-medium mb-4 font-header">Topics</h1>
                {/* Button to toggle the form */}
                <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mb-2">
                    <span className="mr-2">+</span>
                    <span>Create Topic</span>
                </button>
            </div>
        </div>
    );
};

export default HomePage;