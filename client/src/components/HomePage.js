// src/components/HomePage.js
import React from 'react';
import logo from '../PiastaFigma.png';
import avatar from '../blankPFPRound.png';

const HomePage = () => {
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
                        <p className="mb-2 cursor-pointer mt-2">Profile</p>
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
                <div className="bg-white p-4 mb-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2">Post Title</h2>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
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
