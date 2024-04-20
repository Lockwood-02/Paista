import React, { useState, useEffect } from 'react';
import axiosInstance from "../../modules/axiosInstance";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ViewPost = () => {
    const [user, setUser] = useState({});
    const [Topic_ID, setTopic_ID] = useState(null);
    const [Solution_ID, setSolution_ID] = useState(null);
    const [Title, setTitle] = useState('');
    const [Body, setBody] = useState('');
    const [Anonymous, setAnonymous] = useState('Unanonymous');
    const [Type, setType] = useState('Unresolved');
    const [creatorUsername, setCreatorUsername] = useState('Anonymous');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    //used for comments
    const [comBody, setComBody] = useState('');
    const [comAnon, setComAnon] = useState('Unanonymous');

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
                        
                        //display the posters name
                        if(Anonymous !== "Anonymous"){
                            let creator = await axiosInstance.get("api/users/" + Creator_ID);
                            setCreatorUsername(creator.username);
                        }
                    }
            }catch(err){
                console.error('Error fetching post info: ', err);
            }
        };

        fetchUser();
        fetchPost();

        return () => {

        };

    }, []);

    const handleAnonymousChange = (e) => {
        setAnonymous(e.target.value);
    }

    if(!Body){
        return(
            <div>
                Post could not be retrieved
            </div>
        )
    }else{
        return(
            <div>
                <div className='mb-4'>
                    <h1 className="text-4xl font-medium font-header">{Title}</h1>
                    <p>Created on: </p>
                    <p>Last Updated: </p>
                    <p>{Body}</p>
                </div>
            </div>
        )
    }
}