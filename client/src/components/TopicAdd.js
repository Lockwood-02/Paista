// FormComponent.js
import React from 'react';

const TopicAdd = () => {
  return (
    <div>
      <h1>Create Topic</h1>
      <form>
        {/* <div>
          <label htmlFor="course">Course:</label>
          <input type="text" id="course" name="course" />
        </div> */}
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" rows="4" cols="50"></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TopicAdd;
