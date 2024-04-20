import React, { useState, useEffect } from 'react';
import axiosInstance from "../../modules/axiosInstance";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ViewPost = () => {
    const [user, setUser] = useState({});
    const [Topic_ID, setTopic_ID] = useState(null);
    const [Solution_ID, setSolution_ID] = useState(null);
    const [Thread_ID, setThread_ID] = useState(null);
    const [Title, setTitle] = useState('');
    const [Body, setBody] = useState('');
    const [Anonymous, setAnonymous] = useState('Unanonymous');
    const [Type, setType] = useState('Unresolved');
    const [Deleted, setDeleted] = useState(false)
    const [creatorUsername, setCreatorUsername] = useState('Anonymous');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    //used for comments
    const [comBody, setComBody] = useState('');
    const [comAnon, setComAnon] = useState('Unanonymous');

    //voting
    const [vote, setVote] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);

    //get query params to determine post id
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const Post_ID = query.get('Post_ID');
    
    //redirect
    const nav = useNavigate();

    //ChatGPT generated helper function
    function formatDate(inputDate) {
        const date = new Date(inputDate);
        
        // Extract hours, minutes, month, day, and year
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getUTCDate()).padStart(2, '0');
        const year = date.getUTCFullYear();
      
        // Format the date string
        const formattedDate = `${hours}:${minutes} ${month}/${day}/${year}`;
        
        return formattedDate;
      }

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
                        setThread_ID(res.data.Thread_ID);
                        setTopic_ID(res.data.Topic_ID);
                        setSolution_ID(res.data.Solution_ID);
                        setTitle(res.data.Title);
                        setBody(res.data.Body);
                        setAnonymous(res.data.Anonymous ? "Anonymous" : "Unanonymous");
                        setType(res.data.Type);
                        setDeleted(res.data.Deleted);
                        setCreatedAt(formatDate(res.data.createdAt));
                        setUpdatedAt(formatDate(res.data.updatedAt));
                        
                        //display the posters name
                        if(Anonymous !== "Anonymous"){
                            let creator = await axiosInstance.get("api/users/" + res.data.Creator_ID);
                            console.log("Creator: ", creator);
                            setCreatorUsername(creator.data.username);
                        }
                    }
            }catch(err){
                console.error('Error fetching post info: ', err);
            }
        };

        fetchUser();
        fetchPost();
        //fetchVotes();

        return () => {

        };

    }, []);

    useEffect( () => {
        const fetchVote = async () => {
            try{
                //get votes on post by postID and userID to see if user has voted on post
                const vote = await axiosInstance.get("/api/userVote/" + user.id + "/" + Post_ID);
                if(vote.data.id){
                    console.log("current User has voted on the post", vote.data);
                    setVote(true);
                }else{
                    console.log("Current user has not voted on the post", vote.error);
                }
            }catch(err){
                console.error('Error fetching vote info: ', err);
            }
        }

        if(user.id){
            console.log("fetching vote");
            fetchVote();
            //fetchVotes();
        }

        return () => {

        };

    }, [user])

    const handleAnonymousChange = (e) => {
        setAnonymous(e.target.value);
    }

    const handleVote = async (e) => {
        try{
            const voteData = await axiosInstance.get("/api/userVote/" + user.id + "/" + Post_ID);
            //if the user has voted
            if(voteData.data.id){
                const res = await axiosInstance.delete("/api/votes/" + voteData.data.id)
                if(res.status == 204){
                    console.log("Vote withdrawn")
                    setVote(false);
                }
            }else{
                const res = await axiosInstance.post("/api/votes", {
                    User_ID: user.id,
                    Post_ID: Post_ID
                })
                if(res.status == 201){
                    console.log("vote cast")
                    setVote(true)
                }
            }
        }catch(err){
            console.log("Error updating vote")
        } 
    }

    if(!Body || Deleted){
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
                    <p>{Type} {Type != "Announcement" ? "Question" : ""} By: {creatorUsername}</p>
                    <p>Created on: {createdAt}</p>
                    <p>Last Updated: {updatedAt}</p>
                    <button
                    onClick={handleVote}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                    {!vote ? "Vote!" : "Withdrawl Vote"}
                    </button>
                    <br></br>
                    <p>{Body}</p>
                </div>
            </div>
        )
    }
}

export default ViewPost;