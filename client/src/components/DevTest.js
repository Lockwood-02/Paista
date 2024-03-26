import React, {useState, useEffect} from 'react';
import axiosInstance from "../modules/axiosInstance";

const DevTest = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await axiosInstance.get("api/test");
                setData(res.data);
                console.log(data);//debug
                setLoading(false);
            } catch (err){
                console.error('Error fetching test data: ', err);
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            //cancel requests or do cleanup
        };

    },[]); //empty dependency array => only run once. Otherwise will run when a dependency updates

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h1>Hello World</h1>
                    <ul>
                        {data.map(item =>(
                            <li>{item.title}:{item.description}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DevTest;