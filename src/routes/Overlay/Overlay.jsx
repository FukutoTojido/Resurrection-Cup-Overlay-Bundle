import { useState, useMemo, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { useCountUp } from "use-count-up";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import osuPerformance from "../../../lib/osujs";

import NowPlaying from "./components/NowPlaying";

import "./Overlay.css";
// import jsonData from "../../../public/config.json";
import particlesJson from "../../../public/particles.json";

const Team = (props) => {
    return (
        <div className={`team ${props.pos}`}>
            <div
                className="icon"
                style={{
                    backgroundImage: `url("./team/${props.idx < 0 ? "" : props.jsonData.teamList[props.idx].teamIconURL}")`,
                }}
            ></div>
            <div className="nameStar">
                <div className="name">{props.idx < 0 ? "" : props.jsonData.teamList[props.idx]?.teamName}</div>
                {props.socketData.tourney?.manager.bools.starsVisible ? (
                    <div className="starContainer">
                        {[...Array(props.socketData.tourney?.manager.bestOF ? Math.ceil(props.socketData.tourney.manager.bestOF / 2) : 0).keys()].map(
                            (idx) => {
                                return (
                                    <div
                                        className={`star ${idx < props.socketData.tourney.manager.stars[props.pos] ? "highlighted" : ""}`}
                                        key={idx}
                                    ></div>
                                );
                            }
                        )}
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

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
    SV2: "SCORE_V2",
    TB: "",
    NM: "",
    FM: "",
    "??": "",
};

function Overlay() {
    const [socketData, setSocketData] = useState({});
    const [naviStatus, setNaviStatus] = useState({});
    const [json, setJson] = useState({});
    const [mapId, setMapId] = useState(0);

    const [startLeft, setStartLeft] = useState(0);
    const [endLeft, setEndLeft] = useState(0);
    const [startRight, setStartRight] = useState(0);
    const [endRight, setEndRight] = useState(0);

    const [roundStatus, setRoundStatus] = useState({
        left: -1,
        right: -1,
        name: "",
    });

    // const [config, setConfig] = useState({
    //     round: "",
    //     team: {
    //         left: "",
    //         right: "",
    //     },
    //     teamList: [],
    //     pool: {}
    // })

    const [mapStat, setMapStat] = useState({
        CS: 0,
        AR: 0,
        OD: 0,
        BPM: 0,
        SR: 0,
    });

    const leftCountUp = useCountUp({
        isCounting: true,
        start: startLeft,
        end: endLeft,
        duration: 0.2,
        easing: "linear",
        decimalPlaces: 0,
        thousandsSeparator: ",",
        decimalSeparator: ".",
    });

    const rightCountUp = useCountUp({
        isCounting: true,
        start: startRight,
        end: endRight,
        duration: 0.2,
        easing: "linear",
        decimalPlaces: 0,
        thousandsSeparator: ",",
        decimalSeparator: ".",
    });

    const ws = useWebSocket("ws://127.0.0.1:24050/ws", {
        onOpen: () => {
            console.log("WebSocket Connected");
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);

            if (
                data.menu.bm.id !== socketData.menu?.bm.id ||
                data.menu.bm.stats.fullSR !== socketData.menu?.bm.stats.fullSR ||
                data.tourney.manager.bestOF !== socketData.tourney?.manager.bestOF ||
                JSON.stringify(data.tourney.manager.bools) !== JSON.stringify(socketData.tourney?.manager.bools) ||
                JSON.stringify(data.tourney.manager.teamName) !== JSON.stringify(socketData.tourney.manager.teamName) ||
                JSON.stringify(data.tourney.manager.stars) !== JSON.stringify(socketData.tourney.manager.stars) ||
                JSON.stringify(data.tourney.manager.gameplay.score) !== JSON.stringify(socketData.tourney.manager.gameplay.score)
            ) {
                if (data.menu.bm.id !== socketData.menu?.bm.id) setMapId(data.menu.bm.id);
                if (JSON.stringify(data.tourney.manager.gameplay.score) !== JSON.stringify(socketData.tourney?.manager.gameplay.score)) {
                    setStartLeft(socketData.tourney?.manager.gameplay.score.left ?? 0);
                    setEndLeft(data.tourney.manager.gameplay.score.left);

                    setStartRight(socketData.tourney?.manager.gameplay.score.right ?? 0);
                    setEndRight(data.tourney.manager.gameplay.score.right);

                    leftCountUp.reset();
                    rightCountUp.reset();
                }
                if (
                    !data.tourney.manager.bools.scoreVisible &&
                    socketData.tourney?.manager.bools.scoreVisible &&
                    data.tourney.manager.bools.starsVisible
                ) {
                    const winningSide =
                        socketData.tourney.manager.gameplay.score.left > socketData.tourney.manager.gameplay.score.right
                            ? "left"
                            : socketData.tourney.manager.gameplay.score.left < socketData.tourney.manager.gameplay.score.right
                            ? "right"
                            : "none";

                    wsController.sendJsonMessage({
                        type: "setWinner",
                        data: {
                            winner: winningSide,
                            map: modId,
                        },
                    });

                    wsController.sendJsonMessage({
                        type: "nextPick",
                    });
                }
                setSocketData(data);
            }
        },
        onError: (errorEvent) => {
            console.log(errorEvent);
        },
        shouldReconnect: (closeEvent) => true,
    });

    const wsController = useWebSocket("ws://localhost:3727/ws", {
        onOpen: () => {
            console.log("Controller WebSocket Connected");
            askForInitialData();
        },
        onMessage: (event) => {
            if (event.data[0] !== "{") return;
            const mes = JSON.parse(event.data);

            switch (mes.type) {
                case "setNaviStatus":
                    setNaviStatus(mes.data);
                    break;
                case "setInitialData":
                    setRoundStatus(mes.data);
                    break;
            }
        },
    });

    const askForInitialData = () => {
        wsController.sendJsonMessage({ type: "fetchInitRoundData" }, false);
    };

    const getMapStat = async (mod) => {
        const folderPath = encodeURIComponent(socketData.menu.bm.path.folder);
        const osuFile = encodeURIComponent(socketData.menu.bm.path.file);
        const res = await fetch(`http://127.0.0.1:24050/Songs/${folderPath}/${osuFile}`);
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

        setMapStat({
            CS: beatmapData.difficulty.circleSize,
            AR: difficultyAttributes.approachRate.toFixed(1),
            OD: difficultyAttributes.overallDifficulty.toFixed(1),
            BPM: Math.round(difficultyAttributes.mostCommonBPM),
            SR: difficultyAttributes.starRating.toFixed(2),
        });
    };

    const modId = useMemo(() => {
        let ret = "??";

        if (socketData.menu && json.pool) {
            for (const mod of Object.keys(json.pool)) {
                for (let i = 0; i < json.pool[mod].length; i++) {
                    if (
                        json.pool[mod][i].id === mapId ||
                        (json.pool[mod][i].artist === socketData.menu.bm.metadata.artist &&
                            json.pool[mod][i].title === socketData.menu.bm.metadata.title &&
                            json.pool[mod][i].diff === socketData.menu.bm.metadata.difficulty &&
                            json.pool[mod][i].creator === socketData.menu.bm.metadata.mapper)
                    ) {
                        ret = `${mod}${i + 1}`;
                    }
                }
            }

            getMapStat(ret.slice(0, 2));
        }

        return ret;
    }, [mapId, JSON.stringify(json)]);

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
        document.title = "Resurrection Cup Overlay";
        loadJsonData();
        const interval = setInterval(loadJsonData, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return JSON.stringify(socketData) !== "{}" && JSON.stringify(json) !== "{}" ? (
        <div id="App">
            <div id="overlay">
                <div className="bg"></div>
                <Particles className="particles" init={particlesInit} loaded={particlesLoaded} options={particlesJson} />
                <div className="topBar">
                    <div className="logo">
                        <img src="./Logo.png" />
                    </div>
                    <div className="roundInfo">
                        <div className="roundName">{roundStatus.name}</div>
                        <div className="matchName">
                            {roundStatus.left < 0 ? "" : json.teamList[roundStatus.left].teamName} vs{" "}
                            {roundStatus.right < 0 ? "" : json.teamList[roundStatus.right].teamName}
                        </div>
                    </div>
                </div>
                <div className="bottomBar">
                    <Team pos="left" socketData={socketData} jsonData={json} idx={roundStatus.left} />
                    <Team pos="right" socketData={socketData} jsonData={json} idx={roundStatus.right} />
                    <NowPlaying socketData={socketData} modId={modId} mapStat={mapStat} naviStatus={naviStatus} jsonData={json} />
                    <div className="scoreContainer">
                        <div
                            className={`score left ${
                                socketData.tourney?.manager.gameplay.score.left > socketData.tourney?.manager.gameplay.score.right ? "high" : ""
                            }`}
                        >
                            {leftCountUp.value}
                        </div>
                        <div
                            className={`score right ${
                                socketData.tourney?.manager.gameplay.score.left < socketData.tourney?.manager.gameplay.score.right ? "high" : ""
                            }`}
                        >
                            {rightCountUp.value}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}

export default Overlay;
