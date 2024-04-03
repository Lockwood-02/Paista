import React, {useState, useEffect} from 'react';
import axiosInstance from '../modules/axiosInstance';

const SessionTest = () => {
    const [phrase, setPhrase] = useState('Default');
    const [input, setInput] = useState('');

    const fetchPhrase = async () => {
        try{
            const res = await axiosInstance.get("api/sessionTest");
            console.log(res.data)//debug
            setPhrase(res.data.phrase);
        }catch (err){
            console.error("Error fetching phrase: ", err);
            setPhrase("Error");
        }
    };

    useEffect(() => {
        fetchPhrase();

        return () => {

        };
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handle submit");
        try{
            const res = await axiosInstance.post("api/sessionTest", {
                phrase:input
            });
            console.log(res.data);//debug
            fetchPhrase();
        } catch (err){
            console.error("Error testing session functionality:", err);
        }

    }

    return (
        <div>
            <h1>Your phrase: {phrase}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='phrase'>Phrase:</label>
                <input type='text' id='phrase' name='phrase' value={input} onChange={(e) => setInput(e.target.value)} />
                <button type='submit'>Update</button>
            </form>
        </div>
    )
}

export default SessionTest;