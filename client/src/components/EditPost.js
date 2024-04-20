import React, { useState, useEffect } from 'react';
import axiosInstance from "../modules/axiosInstance";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const EditPost =() => {
    const [user, setUser] = useState({});
    const [Creator_ID, setCreator_ID] = useState(null);
    const [Thread_ID, setThread_ID] = useState(null);
    const [Topic_ID, setTopic_ID] = useState(null);
    const [Solution_ID, setSolution_ID] = useState(null);
    const [Title, setTitle] = useState('');
    const [Body, setBody] = useState('');
    const [Anonymous, setAnonymous] = useState('Unanonymous');
    const [Type, setType] = useState('Unresolved');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(true);

    //get query params to determine post id
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const Post_ID = query.get('Post_ID');

    //redirect
    const nav = useNavigate();

    useEffect( () => {
        const fetchUser = async () => {
            try{
                const res = await axiosInstance.get("api/getUser");
                console.log("Setting user: ", res.data);
                setUser(res.data);
            }catch(err){
                console.error('Error fetching user info: ', err);
            }
        };

        const fetchPost = async () => {
            try{
                const res = await axiosInstance.get("api/Posts/" + Post_ID);
                    console.log("Setting post: ", res.data);
                    if(res.data.error){
                        console.log("Could not fetch post")
                        setValid(false);
                    }else{
                        setCreator_ID(res.data.Creator_ID);
                        setThread_ID(res.data.Thread_ID);
                        setTopic_ID(res.data.Topic_ID);
                        setSolution_ID(res.data.Solution_ID);
                        setTitle(res.data.Title);
                        setBody(res.data.Body);
                        setAnonymous(res.data.Anonymous ? "Anonymous" : "Unanonymous");
                        setType(res.data.Type);
                    }
            }catch(err){
                console.error('Error fetching post info: ', err);
            }
        };

        fetchUser();
        fetchPost();

        setLoading(false);
        console.log("Done loading");

        return () => {

        };

    }, []);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        //data validation

        //axios post
    }

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }else if(user.id !== Creator_ID){
        return (
            <div>
                You do not have permission to edit this post
            </div>
        )
    }else{
        return (
            <div>
                <div className="mb-4">
                    <h1 className="text-4xl font-medium font-header">Edit Post</h1>
                    <div>
                        <div className="bg-white p-4 mb-4 rounded shadow">
                            <form onSubmit={handleSaveChanges} className="space-y-4">
                                <div>
                                    <label htmlFor="Title" className="block">
                                        <h2 className="text-xl font-bold mb-2">Title</h2>
                                        <input
                                        type="text"
                                        id="Title"
                                        name="Title"
                                        value={Title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                        />
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditPost