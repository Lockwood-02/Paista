import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from "../modules/axiosInstance";
import CreatePost from './Post/CreatePost';
import { Link } from 'react-router-dom';

const TopicDetailPage = (props) => {
  const { Topic_ID } = useParams();
  const [topic, setTopic] = useState(null);
  const [post, setPost] = useState(null);
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get("api/Posts/"); // Assuming your backend API endpoint is '/api/topic/:topicId'
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };

    fetchPost();

    return () => {
      // Cleanup
    };
  }, []);

  const handleCreatePostToggle = () => {
    setIsCreatePostOpen(!isCreatePostOpen); // Toggle the state to open/close the CreatePost component
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}


if (!post) {
    return <div>Loading...</div>;
} else {
  return (
    <div className=''>
    {topic && (
        <div>
            <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold flex-grow">{topic.title}</h1>
                <p className="text-md text-gray-400">{formatDate(topic.createdAt)}</p>
            </div>
            <hr className="my-2 border-gray-300"/>
            <p className="text-xl text-gray-600">{topic.description}</p>
        </div>
    )}

    {/* Create Post Button */}
    <button onClick={handleCreatePostToggle} className="bg-blue-500 text-white py-2 px-4 rounded mt-24 mb-4">Create Post</button>

    {/* Posts */}
    {post.map(com => (
        <Link to={`/viewPost?Post_ID=${com.ID}`} key={com.ID}>
            <div className="bg-white p-4 mb-4 rounded shadow">
                <p className="text-sm font-semibold">{com.username}</p>
                <p>{com.Title}</p>
                <p className="text-xs">-{formatDate(com.updatedAt)}</p>
            </div>
        </Link>
    ))}

    {/* Conditionally render the CreatePost component */}
    {isCreatePostOpen && <CreatePost user={props.user}/>}
</div>
  );
};
};

export default TopicDetailPage;
