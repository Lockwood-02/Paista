import React, { useEffect } from 'react'

function App() {
  useEffect(() =>{
    // When going to the users page it does not work
    fetch('http://localhost:8081/')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  }, [])
  
  return (
    <div>

    </div>
  )
}

export default App