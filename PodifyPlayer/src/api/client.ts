import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.1.16:8998',
});

export default client;
