import React, { useState, useEffect } from 'react';
import axiosInstance from '../modules/axiosInstance';

const TopicAdd = ({ onClose, initialData }) => {
  const initialFormData = {
    title: initialData ? initialData.title : '',
    description: initialData ? initialData.description : '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [topics, setTopics] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get('/api/topics');
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() && !formData.description.trim()) {
        // Check if both title and description are empty
        throw new Error('Title and description cannot be empty');
      }

      if (initialData) {
        await updateTopic(formData);
      } else {
        await createTopic(formData);
      }

      // Reset the form data
      setFormData(initialFormData);
      onClose(); // Close the form after successful submission
      window.location.reload();
    } catch (error) {
      console.error('Error creating/updating topic:', error);
      // Handle error
    }
  };

  const createTopic = async (data) => {
    await axiosInstance.post('/api/topics', data);
  };

  const updateTopic = async (data) => {
    await axiosInstance.put(`/api/topics/${initialData.id}`, data);
  };

  const handleCancel = () => {
    onClose(); // Close the form when cancel button is clicked
    setIsVisible(false); // Hide the form
  };

  return isVisible ? (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-1/2">
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Update Topic' : 'Create New Topic'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full h-36"
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
              {initialData ? 'Update' : 'Submit'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
        {/* Render topics */}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Topics</h2>
          <ul>
            {topics.map((topic) => (
              <li key={topic.id}>{topic.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : null;
};

export default TopicAdd;