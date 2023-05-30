import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

import "./Showcase.css";
import jsonData from "../../../public/config.json";

function Showcase() {
    const [socketData, setSocketData] = useState({});
    const [modId, setModId] = useState("");

    const ws = useWebSocket("ws://127.0.0.1:24050/ws", {
        onOpen: () => {
            console.log("WebSocket connected");
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);

            if (
                data.menu.bm.id !== socketData.menu?.bm.id ||
                data.menu.mods.num !== socketData.menu?.mods.num ||
                data.gameplay.name !== socketData.gameplay?.name ||
                data.menu.bm.stats.fullSR !== socketData.menu.bm.stats.fullSR
            ) {
                setSocketData(data);
                setModId("??");
                for (const mod of Object.keys(jsonData.pool)) {
                    jsonData.pool[mod].forEach((map, idx) => {
                        if (
                            map.id === data.menu.bm.id ||
                            (map.artist === data.menu.bm.metadata.artist &&
                                map.title === data.menu.bm.metadata.title &&
                                map.diff === data.menu.bm.metadata.difficulty &&
                                map.creator === data.menu.bm.metadata.mapper)
                        ) {
                            setModId(`${mod}${idx + 1}`);
                        }
                    });
                }
            }
        },
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        document.title = "Resurrection Cup Showcase"
    }, [])

    return JSON.stringify(socketData) !== "{}" && socketData.menu ? (
        <div id="App">
            <div id="showcase">
                <div id="stats">
                    <div
                        className="bg"
                        style={{
                            backgroundImage: `url("http://127.0.0.1:24050/Songs/${socketData.menu.bm.path.full
                                .replace(/%/g, "%25")
                                .replace(/#/g, "%23")
                                .replace(/\\/g, "/")
                                .replace(/'/g, "%27")}")`,
                        }}
                    ></div>
                    <div className="rawStats">
                        <div className="stat">
                            CS <span>{socketData.menu.bm.stats.CS}</span>
                        </div>
                        /
                        <div className="stat">
                            AR <span>{socketData.menu.bm.stats.AR}</span>
                        </div>
                        /
                        <div className="stat">
                            OD <span>{socketData.menu.bm.stats.OD}</span>
                        </div>
                        /
                        <div className="stat">
                            BPM{" "}
                            <span>
                                {socketData.menu.bm.stats.BPM.max === socketData.menu.bm.stats.BPM.min
                                    ? socketData.menu.bm.stats.BPM.min
                                    : `${socketData.menu.bm.stats.BPM.min} - ${socketData.menu.bm.stats.BPM.max}`}
                            </span>
                        </div>
                    </div>
                    <div className="starRating">
                        <div className="stat">
                            Star Rating <span>{socketData.menu.bm.stats.fullSR}★</span>
                        </div>
                    </div>
                </div>
                <div id="replayer">
                    replay by
                    <div className="playerName">{socketData.gameplay.name}</div>
                </div>
                <div id="info">
                    <div id="mod" className={modId.slice(0, 2)}>
                        {modId}
                    </div>
                    <div className="metadata">
                        <div id="artistTitle">
                            <div id="title">{socketData.menu.bm.metadata.title}</div>
                            <div id="artist">{socketData.menu.bm.metadata.artist}</div>
                        </div>
                        <div id="mapperDiff">
                            <div id="diff">
                                difficulty: <span>{socketData.menu.bm.metadata.difficulty}</span>
                            </div>
                            <div id="mapper">
                                mapper: <span>{socketData.menu.bm.metadata.mapper}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}

export default Showcase;
