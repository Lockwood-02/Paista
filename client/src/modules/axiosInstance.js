import axios from "axios";

//base url can be chaned based on environment variable to match production env.
export default axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000/" 
})