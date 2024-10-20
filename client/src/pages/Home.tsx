import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";

const Home: React.FC = () => { 
    const navigate = useNavigate();
    const { socket } = useAppContext();

    const handleHostButton = () => {
        if (socket && socket.connected) {
            navigate('/host');
        } else {
            alert('Socket is not connected!');
        }   
    };

    const handleJoinButton = () => {
        if (socket && socket.connected) {
            navigate('/join');
        } else {
            alert('Socket is not connected!');
        }   
    };

    return (
        <div className='home-container'>
            <h1>Buzzer</h1>
            <div>Tool for quiz games!</div>
            <button onClick={handleHostButton}>Host</button>
            <button onClick={handleJoinButton}>Join</button>
        </div>
    )
}

export default Home;