import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";

const Home: React.FC = () => { 
    const navigate = useNavigate();
    const { socket } = useAppContext();

    const handleHostRoomButtonClick = () => {
        if (socket && socket.connected) {
            navigate('/host');
        } else {
            alert('Socket is not connected!');
        }   
    };

    const handleJoinRoomButtonClick = () => {
        if (socket && socket.connected) {
            navigate('/join');
        } else {
            alert('Socket is not connected!');
        }   
    };

    return (
        <div className='home-container'>
            <h1>Home</h1>
            <button onClick={handleHostRoomButtonClick}>Host game</button>
            <button onClick={handleJoinRoomButtonClick}>Join game</button>
        </div>
    )
}

export default Home;