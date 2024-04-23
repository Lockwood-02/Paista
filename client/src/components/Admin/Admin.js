import React, { useState, useEffect } from 'react';
import axiosInstance from "../../modules/axiosInstance";
import { useNavigate } from "react-router-dom";

const Admin = (props) => {
    const [user, setUser] = useState({});
    const [userSearch, setUserSearch] = useState('');
    const [postSearch, setPostSearch] = useState('');
    //lists
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);

    //redirect
    const nav = useNavigate();

    useEffect( () => {
        const fetchUser = async () => {
            if(props.user.id){
                try{
                    console.log("Checking admin based on:", props.user);
                    //need to know if user is class 2 or not
                    const userData = await axiosInstance.get("api/users/" + props.user.id);
                    setUser(userData.data);
                    if(userData.data.userClass != 2){
                        //if the user is not an admin send them to the home page
                        nav("/");
                    }
                }catch(err){
                    console.error('Error fetching user info: ', err);
                    nav("/");
                }
            }
        };

        fetchUser()

        return () => {

        };
    },[props.user])

    const handleUserSearch = async (e) => {
        setUserSearch(e.target.value);
        //dont do all this for an empty string
        if(e.target.value.length > 0){
            try{
                const res = await axiosInstance.get('api/admin/users/' + e.target.value)
                console.log("Found all matching users: ", res.data);
                setUsers(res.data);
            }catch(err){
                console.error("failed to handle user search: ", err);
            }
            
        }
    }

    const handlePostSearch = async (e) => {
        setPostSearch(e.target.value);
        //dont do all this for an empty string
        console.log("setting post search: ", e.target.value, e.target.value.length);
        if(e.target.value.length > 0){
            try{
                const res = await axiosInstance.get('api/admin/posts/' + e.target.value)
                console.log("Found all matching posts: ", res.data);
                setPosts(res.data);
            }catch(err){
                console.error("failed to handle post search: ", err);
            }
            
        }
    }

    if(!user){
        return(
            <div>
                Loading...
            </div>
        )
    }else{
        return(
            <div>
                <div className='mb-4'>
                    <h1 className="text-4xl font-medium font-header">Admin Controls</h1>
                    <div className="bg-white p-4 mb-4 rounded shadow">
                        <div>
                            <label htmlFor="Title" className="block">
                                <h2 className="text-xl font-bold mb-2">Find A User:</h2>
                                <input
                                type="text"
                                id="userSearch"
                                name="userSearch"
                                value={userSearch}
                                onChange={handleUserSearch}
                                required
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                />
                            </label>
                        </div>
                        {/*List of usernames that match the search*/}
                        {(users.length < 1 && userSearch.length >0) ? (
                            <div>
                                No users found
                            </div>
                        ) : (
                            users.map(u => (
                                <div key={u.username} className="bg-white p-4 mb-4 rounded shadow flex justify-between">
                                    <span>{u.username}</span>
                                    <button 
                                    onClick={() => nav('/Admin/users/' + u.id)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >Manage</button>
                                </div>
                            ))
                        )}
                        <div>
                            <label htmlFor="Title" className="block">
                                <h2 className="text-xl font-bold mb-2">Find A Post:</h2>
                                <input
                                type="text"
                                id="postSearch"
                                name="postSearch"
                                value={postSearch}
                                onChange={handlePostSearch}
                                required
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                />
                            </label>
                        </div>
                        {/*List of posts that match the search*/}
                        {(posts.length < 1 && postSearch.length >0) ? (
                            <div>
                                No posts found
                            </div>
                        ) : (
                            posts.map(u => (
                                <div key={u.Title} className="bg-white p-4 mb-4 rounded shadow flex justify-between">
                                    <span>{u.Title}</span>
                                    <button 
                                    onClick={() => nav('/Admin/posts/' + u.ID)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >Manage</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Admin