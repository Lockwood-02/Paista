import React, { useState, useEffect } from 'react';
import axiosInstance from "../modules/axiosInstance";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [user, setUser] = useState({});
    const [Title, setTitle] = useState('');
    const [Body, setBody] = useState('');
    const [Anonymous, setAnonymous] = useState('Unanonymous');
    const [Type, setType] = useState('Unresolved');
    const [message, setMessage] = useState('');

    //get query params to determine topic and thread ids
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const Thread_ID = query.get('Thread_ID');
    const Topic_ID = query.get("Topic_ID");

    //redirect
    const nav = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const res = await axiosInstance.get("api/getUser");
                console.log("Setting user: ", res.data);
                setUser(res.data);
            }catch(err){
                console.error('Error fetching user info: ', err);
            }
        };

        fetchUser();
        return () => {

        };

    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        //client side validation of form
        if(['Announcement', 'Resolved', 'Unresolved'].indexOf(Type) < 0){
            setMessage("Error: Invalid post type. Refresh page and try again");
        }else if(!Topic_ID || !user.id){

            setMessage("Error: Could not post. Refresh page and try again");
        }else{
            try{
                const res = await axiosInstance.post("api/Posts", {
                    Creator_ID:user.id,
                    Thread_ID:Thread_ID,
                    Topic_ID:Topic_ID,
                    Solution_ID:null,
                    Title:Title,
                    Body:Body,
                    Deleted:false,
                    Anonymous: (Anonymous == "Anonymous"),
                    Type:Type
                });
                console.log("Axios response: ", res);//debugging
                nav("/")//TODO: change this to go to the posts location
            }catch(err){
                console.error("Error submitting post");
                setMessage("Error: Could not post. Refresh page and try again");
            }
        }

    }

    const handleAnonymousChange = (e) => {
        setAnonymous(e.target.value);
    }

    const handleTypeChange = (e) => {
        setType(e.target.value);
    }

    if(!Topic_ID){
        return (
            <div>
                Invalid post location. Please try creating a post from a topic.
            </div>
        )
    }else{
        return (
            <div>
                <div className="mb-4">
                    <h1 className="text-4xl font-medium font-header">CreatePost</h1>
                    <div>
                        <div className="bg-white p-4 mb-4 rounded shadow">
                            <form onSubmit={handleCreatePost} className="space-y-4">
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

                                <div>
                                    <label htmlFor="Body" className="block">
                                        <h2 className="text-xl font-bold mb-2">Body</h2>
                                        <input
                                        type="text"
                                        id="Body"
                                        name="Body"
                                        value={Body}
                                        onChange={(e) => setBody(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                        />
                                    </label>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold mb-2">Post Anonymously?</h2>
                                    <p>(for saftey purposes administartors will be able to discvoer your identity)</p>
                                    <label htmlFor='Anonymous' className="block">
                                        <input
                                            type="radio"
                                            name="Anonymous"
                                            value="Anonymous"
                                            checked = {Anonymous === "Anonymous"}
                                            onChange={(handleAnonymousChange)}
                                        />
                                        Post Anonymously
                                    </label>
                                    <label htmlFor='Unanonymous' className="block">
                                        <input
                                            type="radio"
                                            name="Unanonymous"
                                            value="Unanonymous"
                                            checked = {Anonymous === "Unanonymous"}
                                            onChange={(handleAnonymousChange)}
                                        />
                                        Show user information in post
                                    </label>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold mb-2">Post Type</h2>
                                    <label htmlFor='Unresolved' className="block">
                                        <input
                                            type="radio"
                                            name="Unresolved"
                                            value="Unresolved"
                                            checked = {Type === "Unresolved"}
                                            onChange={(handleTypeChange)}
                                        />
                                        Question
                                    </label>
                                    <label htmlFor='Announcement' className="block">
                                        <input
                                            type="radio"
                                            name="Announcement"
                                            value="Announcement"
                                            checked = {Type === "Announcement"}
                                            onChange={(handleTypeChange)}
                                        />
                                        Announcement
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Create
                                </button>

                                <div>
                                    <p>{message}</p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreatePost;