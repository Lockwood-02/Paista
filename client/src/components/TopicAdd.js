// FormComponent.js
import React, { useState, useEffect } from 'react';
import axiosInstance from "../modules/axiosInstance";

const TopicAdd = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    // course: '', // If you want to include course field
    title: '',
    description: ''
  });

  const [user, setUser] = useState({});

  //gets the user to pass the user ID as an argument to topic creation
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axiosInstance.get("api/getUser");
            setUser(res.data);
        } catch (err) {
            console.error('Error fetching username: ', err);
        }
    };

    fetchData();

    return () => {
        //cancel requests or do cleanup
    };

  }, []);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {

      //ensure the get user effect has succeeded
      if(!user){
        console.error("Cannot create a topic while not logged in")
      }

      // Send form data to the server
      const response = await axiosInstance.post('/api/topics', {
        title: formData.title,
        description: formData.description,
        userID: user.id
      });

      // Handle success response
      console.log('Topic created:', response.data);

      // Clear form fields after successful submission (if needed)
      setFormData({
        // course: '', // If you want to include course field
        title: '',
        description: ''
      });
    } catch (error) {
      // Handle error response
      console.error('Error creating topic:', error);
    }
  };

  // Function to handle input changes
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  return (
    <div>
      <h1>Create Topic</h1>
      <form onSubmit={handleSubmit}>
        {/* Course field */}
        {/* <div>
          <label htmlFor="course">Course:</label>
          <input 
            type="text" 
            id="course" 
            name="course" 
            value={formData.course} 
            onChange={handleChange} 
          />
        </div> */}

        {/* Title field */}
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description field */}
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            cols="50"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TopicAdd;
