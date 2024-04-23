import React, { useState, useEffect } from 'react';
import axiosInstance from "../modules/axiosInstance";
import { useParams } from 'react-router-dom';

const Profile = (props) => {
    const [data, setData] = useState({})
    const [edit, setEdit] = useState(false)
    const { dataId } = useParams();
    const [user, setUser] = useState({})
    const [message, setMessage] = useState('');

    const fetchUser = async () => {
        try{
            setUser(props.user);
            const userData = await axiosInstance.get("api/users/" + dataId);
            setData(userData.data);
        }catch(err){
            console.error('Error fetching user info: ', err);
        }
    };

    useEffect( () => {
        
        fetchUser();

        return () => {

        };
    },[props.user])

    const handleFirstName = (e) => {
        let dataCopy = { ...data }
        dataCopy.firstName = e.target.value;
        setData(dataCopy)
    }

    const handleLastName = (e) => {
        let dataCopy = { ...data }
        dataCopy.lastName = e.target.value;
        setData(dataCopy)
    }

    const handleEmail = (e) => {
        let dataCopy = { ...data }
        dataCopy.email = e.target.value;
        setData(dataCopy)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //only submit if a user is updating their own data
        if(user.id === data.id){
            try{
                const res = await axiosInstance.put('api/users/' + user.id, data);
                console.log("updated user data to: ", res.data);
                setData(res.data);
            }catch(err){
                //get the real data from the server
                fetchUser();
                setMessage("Error updating, ensure all values are valid");
                console.error("Could not update user data: ", err);
            }
        }else{
            console.warn("Cannot update data for another user");
        }
        setEdit(false);   
    }
    const handleEdit =  () => {
        setEdit(true);
    }

    return (
        <div>
            <div className='mb-4'>
                <h1 className="text-4xl font-medium font-header">{data.username}</h1>
                <p>Joined: {data.dateCreated}</p>
                <p>Role {data.userClass === 2 ? 'Admin' : (data.userClass === 1 ? 'Instructor' : 'Student')}</p>
                {edit ? (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block">Email:</label>
                        <input type="email" id="email" name="email" required value={data.email} onChange={handleEmail} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block">First Name:</label>
                        <input type="text" id="firstName" name="firstName" required value={data.firstName} onChange={handleFirstName} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" required value={data.lastName} onChange={handleLastName} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <button onClick={handleSubmit} id='signupButton' type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Changes</button>
                </div>
                ):(
                    <div>
                        <p>Email: {data.email}</p>
                        <p>Name: {data.firstName} {data.lastName}</p>
                        {/*Allow users to edit their own info*/}
                        {data.id === user.id ? (
                            <button onClick={handleEdit} className="bg-blue-500 text-white py-2 px-4 rounded mt-4 self-start">
                            Edit
                            </button>
                        ):(
                            <div></div>
                        )}
                    </div>
                )}
                <div>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile