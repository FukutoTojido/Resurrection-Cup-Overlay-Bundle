import { useState, useEffect, createContext, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import "./Mappool.css";

import particlesJson from "../../../public/particles.json";

import Player from "./components/Player";
import PoolSection from "./components/PoolSection";
import BottomSection from "./components/BottomSection";

const WS_URL = "ws://localhost:3727/ws";
const ControllerDataContext = createContext();

function Mappool() {
    const [controllerData, setControllerData] = useState({});
    const [socketData, setSocketData] = useState({});
    const [json, setJson] = useState({});
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

    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {}, []);

    const loadJsonData = async () => {
        const res = await fetch("./config.json");
        const data = await res.json();

        if (JSON.stringify(data) !== JSON.stringify(json)) setJson(data);
    };

    useEffect(() => {
        document.title = "Resurrection Cup Mappool";
        loadJsonData();
        const interval = setInterval(loadJsonData, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!isWsInit && connectStatus) wsController.sendJsonMessage({ type: "askInit" }, false);
        if (isWsInit && connectStatus && JSON.stringify(controllerData) === "{}") wsController.sendJsonMessage({ type: "fetchData" }, false);
    }, [isWsInit, connectStatus]);

    return (
        <div id="App">
            <div id="mappool">
                <div className="bg"></div>
                <Particles className="particles" init={particlesInit} loaded={particlesLoaded} options={particlesJson} />
                {JSON.stringify(controllerData) !== "{}" ? (
                    JSON.stringify(socketData) !== "{}" && JSON.stringify(json) !== "{}" ? (
                        <ControllerDataContext.Provider
                            value={{
                                controllerData,
                                socketData,
                                json
                            }}
                        >
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
