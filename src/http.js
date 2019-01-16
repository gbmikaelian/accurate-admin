import axios from 'axios'

export default axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:4008`,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
})
