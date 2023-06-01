import { useState, useEffect, useContext, createContext } from "react";
import useWebSocket from "react-use-websocket";

import "./Mappool.css";

import Player from "./components/Player";
import PoolSection from "./components/PoolSection";
import BottomSection from "./components/BottomSection";

const WS_URL = "ws://localhost:3727/ws";
const ControllerDataContext = createContext();

function Mappool() {
    const [controllerData, setControllerData] = useState({});
    const [socketData, setSocketData] = useState({});
    const [isWsInit, setIsWsInit] = useState(false);
    const [connectStatus, setConnectStatus] = useState(false);

    const wsController = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log("Controller WebSocket connected");
            setConnectStatus(true);
        },
        onMessage: (event) => {
            console.log(JSON.parse(event.data));
            if (event.data[0] !== "{") return;

            const mes = JSON.parse(event.data);

            switch (mes.type) {
                case "setOverlay":
                    setControllerData(mes.data);
                    break;
                case "confirmInit":
                    setIsWsInit(true);
                    break;
                case "setPoolStatus":
                    const temp = { ...controllerData };
                    temp.status.poolStatus = mes.data;
                    setControllerData(temp);
                    break;
                case "setNaviStatus":
                    const tempNavi = { ...controllerData };
                    tempNavi.status.naviStatus = mes.data;
                    setControllerData(tempNavi);
                    break; 
            }
        },
        onClose: () => {
            setConnectStatus(false);
            setIsWsInit(false);

            console.log("WebSocket disconnected");
        },
        shouldReconnect: (closeEvent) => true,
    });

    const ws = useWebSocket("ws://127.0.0.1:24050/ws", {
        onOpen: () => {
            console.log("gosumemory WebSocket Connected");
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);

            if (
                JSON.stringify(data.tourney.manager.stars) !== JSON.stringify(socketData.tourney?.manager.stars) ||
                JSON.stringify(data.tourney.manager.chat) !== JSON.stringify(socketData.tourney?.manager.chat)
            ) {
                setSocketData(data);
            }
        },
    });

    useEffect(() => {
        if (!isWsInit && connectStatus) wsController.sendJsonMessage({ type: "askInit" }, false);
        if (isWsInit && connectStatus && JSON.stringify(controllerData) === "{}") wsController.sendJsonMessage({ type: "fetchData" }, false);
    }, [isWsInit, connectStatus]);

    return (
        <div id="App">
            <div id="mappool">
                <div className="bg"></div>
                {JSON.stringify(controllerData) !== "{}" ? (
                    JSON.stringify(socketData) !== "{}" ? (
                        <ControllerDataContext.Provider value={{
                            controllerData,
                            socketData
                        }}>
                            <Player />
                            <PoolSection />
                            <BottomSection />
                        </ControllerDataContext.Provider>
                    ) : (
                        ""
                    )
                ) : (
                    "Please open your ResCup app in order to use this overlay"
                )}
            </div>
        </div>
    );
}

export default Mappool;
export { ControllerDataContext };
