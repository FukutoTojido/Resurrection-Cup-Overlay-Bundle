import { useState, useEffect, useMemo } from "react";
import useWebSocket from "react-use-websocket";

import osuPerformance from "../../../lib/osujs";

import "./Showcase.css";
// import jsonData from "../../../public/config.json";

const modsParse = {
    EZ: "EASY",
    HT: "HALF_TIME",
    NF: "NO_FAIL",
    HR: "HARD_ROCK",
    SD: "SUDDEN_DEATH",
    PF: "PERFECT",
    DT: "DOUBLE_TIME",
    NC: "NIGHT_CORE",
    HD: "HIDDEN",
    FL: "FLASH_LIGHT",
    AT: "AUTO_PLAY",
    AP: "AUTO_PILOT",
    RX: "RELAX",
    SO: "SPUN_OUT",
    V2: "SCORE_V2",
    TB: "",
    NM: "",
    FM: "",
    "??": "",
};

function Showcase() {
    const [socketData, setSocketData] = useState({});
    const [json, setJson] = useState({});
    const [mapId, setMapId] = useState(0);
    const [mapData, setMapData] = useState({
        artist: "",
        title: "",
        creator: "",
        difficulty: "",
    });
    const [mapStat, setMapStat] = useState({
        CS: 0,
        AR: 0,
        OD: 0,
        BPM: 0,
        SR: 0,
    });
    const [mod, setMod] = useState("NM");
    const [filePath, setFilePath] = useState("");

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
                data.menu.bm.time.full !== socketData.menu?.bm.time.full ||
                data.menu.bm.stats.fullSR !== socketData.menu?.bm.stats.fullSR ||
                data.menu.bm.path.folder !== socketData.menu?.bm.path.folder ||
                data.menu.bm.path.file !== socketData.menu?.bm.path.file ||
                data.menu.state !== socketData.menu?.state
            ) {
                setSocketData(data);
                setMapData({
                    artist: data.menu.bm.metadata.artist,
                    title: data.menu.bm.metadata.title,
                    creator: data.menu.bm.metadata.mapper,
                    difficulty: data.menu.bm.metadata.difficulty,
                });

                if (data.menu.bm.id !== socketData.menu?.bm.id) {
                    setMapId(data.menu.bm.id);
                }
                if (data.menu.mods.num !== socketData.menu?.mods.num) setMod(data.menu.mods.str);
                if (data.menu.bm.path.folder !== socketData.menu?.bm.path.folder || data.menu.bm.path.file !== socketData.menu?.bm.path.file) {
                    const folderPath = encodeURIComponent(data.menu.bm.path.folder);
                    const osuFile = encodeURIComponent(data.menu.bm.path.file);
                    setFilePath(`http://127.0.0.1:24050/Songs/${folderPath}/${osuFile}`);
                }
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

    const getMapStat = async (mod) => {
        const res = await fetch(filePath);
        const rawData = await res.text();

        const parsedMod = mod
            .match(/.{1,2}/g)
            .map((abbr) => modsParse[abbr])
            .filter((m) => m !== "");
        const builderOptions = {
            addStacking: true,
            mods: parsedMod,
        };

        const blueprintData = osuPerformance.parseBlueprint(rawData);
        const beatmapData = osuPerformance.buildBeatmap(blueprintData, builderOptions);

        const difficultyAttributes = osuPerformance.calculateDifficultyAttributes(beatmapData, true)[0];
        // console.log(beatmapData);

        const lastObj = beatmapData.hitObjects.at(-1);
        const firstObj = beatmapData.hitObjects.at(0);

        const endTime = !lastObj.startTime ? lastObj.hitTime : lastObj.startTime;
        const startTime = !firstObj.startTime ? firstObj.hitTime : firstObj.startTime;

        const fullTime = msToTime((endTime - startTime) * beatmapData.gameClockRate);

        if (difficultyAttributes)
            setMapStat({
                CS: beatmapData.difficulty.circleSize.toFixed(1),
                AR: difficultyAttributes.approachRate.toFixed(1),
                OD: difficultyAttributes.overallDifficulty.toFixed(1),
                BPM: Math.round(difficultyAttributes.mostCommonBPM),
                SR: difficultyAttributes.starRating.toFixed(2),
                Length: fullTime,
            });
    };

    const msToTime = (ms) => {
        const s = `${Math.floor(ms / 1000) % 60}`.padStart(2, "0");
        const m = Math.floor(ms / 1000 / 60);

        return `${m}:${s}`;
    };

    const modId = useMemo(() => {
        let ret = "??";

        if (socketData.menu && json.pool) {
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
        }

        return ret;
    }, [mapId, JSON.stringify(json), JSON.stringify(mapData)]);

    useEffect(() => {
        // console.log("a");
        if (socketData.menu) getMapStat(mod);
    }, [filePath, mod]);

    return JSON.stringify(socketData) !== "{}" && socketData.menu && JSON.stringify(json) !== "{}" ? (
        <div id="App">
            <div id="showcase">
                <div
                    id="stats"
                    style={{
                        transform: `translateX(${socketData.menu.state !== 2 ? "-1000px" : "0"})`,
                    }}
                >
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
                            CS <span>{mapStat.CS}</span>
                        </div>
                        /
                        <div className="stat">
                            AR <span>{mapStat.AR}</span>
                        </div>
                        /
                        <div className="stat">
                            OD <span>{mapStat.OD}</span>
                        </div>
                        /
                        <div className="stat">
                            BPM <span>{mapStat.BPM}</span>
                        </div>
                        /
                        <div className="stat">
                            Length <span>{mapStat.Length}</span>
                        </div>
                    </div>
                    <div className="starRating">
                        <div className="stat">
                            Star Rating <span>{mapStat.SR}★</span>
                        </div>
                    </div>
                </div>
                <div
                    id="replayer"
                    style={{
                        opacity: `${socketData.menu.state !== 2 ? "0" : "1"}`,
                    }}
                >
                    replay by
                    <div className="playerName">{socketData.gameplay.name}</div>
                </div>
                <div
                    id="info"
                    style={{
                        opacity: `${socketData.menu.state !== 2 ? "0" : "1"}`,
                    }}
                >
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
