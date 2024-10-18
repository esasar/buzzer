import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error(`useSocketContext muse be used within a SocketProvider`);
    }

    return context;
};