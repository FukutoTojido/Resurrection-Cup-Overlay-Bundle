import { useState, useEffect, useMemo } from "react";
import useWebSocket from "react-use-websocket";

import "./Showcase.css";
// import jsonData from "../../../public/config.json";

function Showcase() {
    const [socketData, setSocketData] = useState({});
    const [json, setJson] = useState({});
    const [mapId, setMapId] = useState(0);

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

                if (data.menu.bm.id !== socketData.menu?.bm.id) setMapId(data.menu.bm.id);
            }
        },
        shouldReconnect: (closeEvent) => true,
    });

    const loadJsonData = async () => {
        const res = await fetch("./config.json");
        const data = await res.json();

        if (JSON.stringify(data) !== JSON.stringify(json)) setJson(data);
    };

    useEffect(() => {
        document.title = "Resurrection Cup Showcase";
        loadJsonData();
        const interval = setInterval(loadJsonData, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const modId = useMemo(() => {
        let ret = "??";

        if (socketData.menu && json.pool)
            for (const mod of Object.keys(json.pool)) {
                json.pool[mod].forEach((map, idx) => {
                    if (
                        map.id === socketData.menu.bm.id ||
                        (map.artist === socketData.menu.bm.metadata.artist &&
                            map.title === socketData.menu.bm.metadata.title &&
                            map.diff === socketData.menu.bm.metadata.difficulty &&
                            map.creator === socketData.menu.bm.metadata.mapper)
                    ) {
                        ret = `${mod}${idx + 1}`;
                    }
                });
            }

        return ret;
    }, [mapId, JSON.stringify(json)]);

    return JSON.stringify(socketData) !== "{}" && socketData.menu && JSON.stringify(json) !== "{}" ? (
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
