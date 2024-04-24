import React, { useState, useEffect } from 'react';
import axiosInstance from "../../modules/axiosInstance";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ViewPost = (props) => {
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

    //used for making comments
    const [comBody, setComBody] = useState('');
    const [comAnon, setComAnon] = useState('Unanonymous');

    //voting
    const [vote, setVote] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);

    //used for existing comments
    const [comments, setComments] = useState([]);

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

    const fetchComments = async () => {
        try{
            const res = await axiosInstance.get("api/getThread/" + Post_ID);
            console.log("comments data: ", res.data);
            if(!res.data.error){
                setComments(res.data);
            }else{
                console.error("Error fetching comments: ", res.data.error)
            }
        }catch(err){
            console.error('Error fetching user info: ', err);
        }
    }

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    useEffect( () => {

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

        fetchPost();
        if(!Thread_ID){
            fetchComments();
        }
        
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

    useEffect( () => {
        const fetchVotes = async () => {
            try{
                const voteCount = await axiosInstance("/api/totalVotes/" + Post_ID);
                if(!voteCount.data.error){
                    setTotalVotes(voteCount.data.count)
                }else{
                    console.error(voteCount.data.error);
                }
            }catch(err){
                console.error('Error fetching vote count', err);
            }
        }

        fetchVotes();

        return () => {

        };

    }, [vote])

    const handleAnonymousChange = (e) => {
        setComAnon(e.target.value);
    }

    const handleVote = async (e) => {
        try{
            const voteData = await axiosInstance.get("/api/userVote/" + user.id + "/" + Post_ID);
            //if the user has voted
            if(voteData.data.id){
                const res = await axiosInstance.delete("/api/votes/" + voteData.data.id)
                if(res.status === 204){
                    console.log("Vote withdrawn")
                    setVote(false);
                }
            }else{
                const res = await axiosInstance.post("/api/votes", {
                    User_ID: user.id,
                    Post_ID: Post_ID
                })
                if(res.status === 201){
                    console.log("vote cast")
                    setVote(true)
                }
            }
        }catch(err){
            console.log("Error updating vote")
        } 
    }

    const handleComment = async (e) => {
        e.preventDefault();
        console.log("submitting comment");
        try{
            const res = await axiosInstance.post("api/Posts", {
                Creator_ID:user.id,
                Thread_ID:Post_ID,
                Topic_ID:Topic_ID,
                Solution_ID:Solution_ID,
                Title:"Response to: " + Title,
                Body:comBody,
                Deleted:false,
                Anonymous: (comAnon === "Anonymous"),
                Type:"Announcement"
            });
            console.log("Axios response: ", res);//debugging
            setComAnon("Unanonymous");
            setComBody('');
            fetchComments();
        }catch(err){
            console.error("Error posting comment", err);
        }
    }

    //pull and display existing comments

    //solution functionality

    if(!Body || Deleted){
        return(
            <div>
                Post could not be retrieved
            </div>
        )
    }else{
        return(
            <div className=''>
    <div className='mb-4'>
        {/* Title and Post Details */}
        <div className="bg-white p-4 mb-4 rounded shadow">
            <h1 className="text-4xl font-medium font-header">{Title}</h1>
            <p>{Type} {Type !== "Announcement" ? "Question" : ""} By: {Anonymous === "Anonymous" ? "Anonymous" : creatorUsername}</p>
            <p>Created on: {createdAt}</p>
            <p>Last Updated: {updatedAt}</p>
            <hr className="my-2 border-gray-300"/>
            <p className='text-xl'>{Body}</p>
        </div>

        {/* Vote Button */}
        <div className=''>
            <button
                onClick={handleVote}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {!vote ? "Vote!" : "Withdraw Vote"} ({totalVotes})
            </button>
        </div>

        {/* Comment Form */}
        {!Thread_ID && (
            <div className='mt-12'>
                <form onSubmit={handleComment} className="space-y-4">
                    <div>
                        <label htmlFor="Body" className="block">
                            <h2 className="text-xl font-bold mb-2">Leave a comment</h2>
                            <input
                                type="text"
                                id="Body"
                                name="Body"
                                value={comBody}
                                onChange={(e) => setComBody(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            />
                        </label>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2">Post Anonymously?</h2>
                        <p>(for safety purposes administrators will be able to discover your identity)</p>
                        <label htmlFor='Anonymous' className="block">
                            <input
                                type="radio"
                                name="Anonymous"
                                value="Anonymous"
                                checked={comAnon === "Anonymous"}
                                onChange={(handleAnonymousChange)}
                            />
                            Post Anonymously
                        </label>
                        <label htmlFor='Unanonymous' className="block">
                            <input
                                type="radio"
                                name="Unanonymous"
                                value="Unanonymous"
                                checked={comAnon === "Unanonymous"}
                                onChange={(handleAnonymousChange)}
                            />
                            Show user information in post
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Comment
                    </button>
                </form>

                {/* Comments */}
                <h2 className="text-xl font-bold mb-2">Comments</h2>
                {comments.map(com => (
                    <div key={com.ID} className="bg-white p-4 mb-4 rounded shadow">
                        <p className="text-sm font-semibold">{com.username}</p>
                        <p>{com.Body}</p>
                        <p className="text-xs">-{formatDate(com.updatedAt)}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
</div>

        )
    }
}

export default ViewPost;