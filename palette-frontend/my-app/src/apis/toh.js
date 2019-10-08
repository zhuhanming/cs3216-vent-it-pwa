import axios from 'axios';
export default axios.create({
    baseURL: 'https://api.ventit.xyz',
    // baseURL: 'http://localhost:3001',
});