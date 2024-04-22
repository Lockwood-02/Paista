import React, { useState, useEffect } from 'react';
import axiosInstance from "../../modules/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

const AdminUsers = () => {
    const [data, setData] = useState({});

    //redirect
    const nav = useNavigate();

    const { dataId } = useParams();

    useEffect( () => {
        const fetchUser = async () => {
            try{
                const res = await axiosInstance.get("api/getUser");
                //need to know if user is class 2 or not
                const userData = await axiosInstance.get("api/users/" + res.data.id);
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
                
                const res = await axiosInstance.get("api/users/" + dataId);
                console.log("Got user data: ", res.data);
                setData(res.data);
            }catch(err){
                console.error("Error getting data for the user to be managed: ", err);
            }
        }

        fetchUser();
        fetchData();

        return () => {

        };
    },[])

    function handleBan(banStatus){
        let dataCopy = { ...data }
        dataCopy.banned = banStatus;
        setData(dataCopy);
    }

    function handleUserClass(e){
        if(data.userClass != 2){
            let dataCopy = { ...data }
            dataCopy.userClass = parseInt(e.target.value);
            setData(dataCopy);
        }
    }

    const handleSave = async () => {
        try{
            console.log("Saving changes... ", data);
            const res = await axiosInstance.put('api/users/' + data.id, data);
            console.log("Axios response: ", res.data);
            setData(res.data)
        }catch(err){
            console.error("Error saving admin changes: ", err);
        }
    }

    if(data){
        return(
            <div>
                <div className='mb-4'>
                    <h1 className="text-4xl font-medium font-header">{data.username}</h1>
                    <p>Joined: {data.dateCreated}</p>
                    <p>Email: {data.email}</p>
                    <p>Name: {data.firstName} {data.lastName}</p>
                    {/*Manage user class*/}
                    <label htmlFor="userClass" className="block text-gray-700 text-sm font-bold mb-2">
                        Change user class:
                    </label>
                    <select
                        id="userClass"
                        name="userClass"
                        value={data.userClass}
                        onChange={handleUserClass}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    >
                        <option value='0'>Basic</option>
                        <option value="1">Instructor</option>
                        <option value="2">Admin</option>
                    </select>

                    {/*Manage user active status*/}
                    <label htmlFor="ban" className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                        Change user ban status:
                    </label>
                    <div className="border border-gray-300 rounded-md p-4">
                        <p>Account Status: {data.banned ? 'Banned' : 'Active'}</p>
                        {data.banned ? (
                            <div className='p-4'>
                                <button onClick={() => handleBan(false)} className="bg-green-500 text-white py-2 px-4 rounded mt-4 self-start">Restore User</button>
                            </div>
                        ) : (
                            <div className='p-4'>
                                <button onClick={() => handleBan(true)} className="bg-red-500 text-white py-2 px-4 rounded mt-4 self-start">BAN USER</button>
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

export default AdminUsers