import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('This is not working');
    fetch('/api/data')
      .then((response) => response.json())
      .then((jsonData) => {
        console.log('Received data:', jsonData); // Log the received data
        setData(jsonData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Your React App</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
