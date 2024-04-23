import React, { useState, useEffect } from 'react';
import axiosInstance from "../../modules/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

const AdminPosts = (props) => {
    const [data, setData] = useState({});

    //redirect
    const nav = useNavigate();

    const { dataId } = useParams();

    useEffect( () => {
        const fetchUser = async () => {
                try{
                    //need to know if user is class 2 or not
                    const userData = await axiosInstance.get("api/users/" + props.user.id);
                    if(userData.data.userClass != 2){
                        //if the user is not an admin send them to the home page
                        nav("/");
                    }
                }catch(err){
                    console.error('Error fetching user info: ', err);
                    nav("/");
                }
        };

        const fetchData = async () => {
            try{
                
                const res = await axiosInstance.get("api/posts/" + dataId);
                console.log("Got post data: ", res.data);
                setData(res.data);
            }catch(err){
                console.error("Error getting data for the post to be managed: ", err);
            }
        }

        if(props.user.id){
            fetchUser();
            fetchData();
        }
        
        return () => {

        };
    },[props.user])

    function handleDelete(deleteStatus){
        let dataCopy = { ...data }
        dataCopy.Deleted = deleteStatus
        setData(dataCopy);
    }

    const handleSave = async () => {
        try{
            console.log("Saving changes... ", data);
            const res = await axiosInstance.put('api/posts/' + data.ID, data);
            console.log("Axios response: ", res.data);
            setData(res.data)
        }catch(err){
            console.error("Error saving admin changes: ", err);
        }
    }
    if(data){
        return (
            <div>
                <div className='mb-4'>
                    <h1 className="text-4xl font-medium font-header">{data.Title}</h1>
                    <label htmlFor="ban" className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                        Change Post's status:
                    </label>
                    <div className="border border-gray-300 rounded-md p-4">
                        <p>Post Status: {data.Deleted ? 'Deleted' : 'Active'}</p>
                        {data.Deleted ? (
                            <div className='p-4'>
                                <button onClick={() => handleDelete(false)} className="bg-green-500 text-white py-2 px-4 rounded mt-4 self-start">Restore Post</button>
                            </div>
                        ) : (
                            <div className='p-4'>
                                <button onClick={() => handleDelete(true)} className="bg-red-500 text-white py-2 px-4 rounded mt-4 self-start">DELETE POST</button>
                            </div>
                        )}
                    </div>
                    {/*Save changes button*/}
                    <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded mt-4 self-start">
                        Save Changes
                    </button>
                </div>
            </div>
        )
    }else{
        return(
            <div>
                Loading...
            </div>
        )
    }
}

export default AdminPosts