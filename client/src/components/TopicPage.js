import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from "../modules/axiosInstance";
import CreatePost from './Post/CreatePost';

const TopicDetailPage = () => {
  const { Topic_ID } = useParams();
  const [topic, setTopic] = useState(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await axiosInstance.get(`api/topics/${Topic_ID}`); // Assuming your backend API endpoint is '/api/topic/:topicId'
        setTopic(res.data);
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };

    fetchTopic();

    return () => {
      // Cleanup
    };
  }, [Topic_ID]);

  const handleCreatePostToggle = () => {
    setIsCreatePostOpen(!isCreatePostOpen); // Toggle the state to open/close the CreatePost component
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

  return (
    <div className=''>
      {topic && (
        <div>
            <div className="flex items-center">
                <h1 className="text-2xl font-bold flex-grow">{topic.title}</h1>
                <p className="text-md text-gray-400">{formatDate(topic.createdAt)}</p>
            </div>
            <hr className="my-2 border-gray-300"/>
            <p className="text-xl text-gray-600">{topic.description}</p>
        </div>
      )}

<button onClick={handleCreatePostToggle}>Create Post</button>

{/* Conditionally render the CreatePost component */}
{isCreatePostOpen && <CreatePost />}
    </div>
  );
};

export default TopicDetailPage;
