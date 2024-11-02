import axios from 'axios';
import { useNavigate } from '@remix-run/react';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5001/api/users/logout', {}, { withCredentials: true });
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return <button onClick={handleLogout}>Sign Out</button>;
}
