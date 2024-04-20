// src/components/Post.js
import React from 'react';

const Topics = ({ course, title, description }) => {
    return (
        <div className="bg-white p-4 mb-4 rounded shadow">
            {/* <h1 className="text-xl font-bold mb-2">{course}</h1> */}
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default Topics;
