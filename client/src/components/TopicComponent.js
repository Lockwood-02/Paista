import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../modules/axiosInstance";

const getAllTopics = async () => {
  try {
    const response = await axiosInstance.get('/api/topics');
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

const TopicComponent = () => {
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsData = await getAllTopics();
        setTopics(topicsData);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const results = topics.filter(topic =>
      topic.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="topic-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Topics..."
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <ul className="topic-list">
        {searchResults.map(topic => (
          <li key={topic.id} className="topic-item">
            <Link to={`/topic/${topic.id}`}>{topic.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicComponent;