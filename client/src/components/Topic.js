// src/components/Post.js
import React from 'react';

const Topic = ({ course, title, description, createdAt }) => {

    // Convert createdAt to a Date object
    const createdAtDate = new Date(createdAt);

    // Format the date to YYYY-MM-DD using toLocaleDateString() method
    const formattedDate = createdAtDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    return (
        <div className="bg-white p-4 mb-4 rounded shadow">
            {/* <h1 className="text-xl font-bold mb-2">{course}</h1> */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default Topic;
