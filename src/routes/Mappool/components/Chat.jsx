import { useContext, useRef, useEffect } from "react";

import "./css/Chat.css";

import { ControllerDataContext } from "../Mappool";

const Chat = () => {
    const { socketData } = useContext(ControllerDataContext);
    const chatRef = useRef(null);

    useEffect(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [JSON.stringify(socketData.tourney.manager.chat)]);

    return (
        <div id="chatContainer">
            <div className="chatWrapper">
                {socketData.tourney?.manager.chat?.map((chat, idx) => {
                    return (
                        <div className="chat" key={idx}>
                            <div className="chatTime">{chat.time}</div>
                            <div className={`chatName ${chat.team}`}>{chat.name}</div>
                            <div className="chatMes">{chat.messageBody}</div>
                        </div>
                    );
                })}
                <div className="end" ref={chatRef}></div>
            </div>
        </div>
    );
};

export default Chat;
