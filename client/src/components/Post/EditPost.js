import React, { useState, useEffect } from 'react';
import axiosInstance from "../../modules/axiosInstance";
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
    const [Deleted, setDeleted] = useState(false)
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
                    }else{
                        setCreator_ID(res.data.Creator_ID);
                        setThread_ID(res.data.Thread_ID);
                        setTopic_ID(res.data.Topic_ID);
                        setSolution_ID(res.data.Solution_ID);
                        setTitle(res.data.Title);
                        setBody(res.data.Body);
                        setAnonymous(res.data.Anonymous ? "Anonymous" : "Unanonymous");
                        setType(res.data.Type);
                        setDeleted(res.data.Deleted);
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
        if(['Announcement', 'Resolved', 'Unresolved'].indexOf(Type) < 0){
            setMessage("Error: Invalid post type. Refresh page and try again");
        }else if(!Topic_ID || !user.id){
            setMessage("Error: Could not update. Refresh page and try again");
        }else{
            try{
                const res = await axiosInstance.put("api/Posts/" + Post_ID, {
                    Creator_ID:user.id,
                    Thread_ID:Thread_ID,
                    Topic_ID:Topic_ID,
                    Solution_ID:Solution_ID,
                    Title:Title,
                    Body:Body,
                    Deleted:Deleted,
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
                                    Save Changes
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

export default EditPost