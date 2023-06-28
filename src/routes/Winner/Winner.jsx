import { useEffect, useState, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import "./Winner.css";

// import jsonData from "../../../public/config.json";
import particlesJson from "../../../public/particles.json";

const Winner = () => {
    const [socketData, setSocketData] = useState({});
    const [json, setJson] = useState({});
    const [winnerTeam, setWinnerTeam] = useState(null);
    const [roundStatus, setRoundStatus] = useState({
        left: -1,
        right: -1,
        name: "",
    });

    const ws = useWebSocket("ws://127.0.0.1:24050/ws", {
        onOpen: () => {
            console.log("WebSocket Connected!");
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);

            if (JSON.stringify(data.tourney.manager.stars) !== JSON.stringify(socketData.tourney?.manager.stars)) {
                if (data.tourney.manager.stars.left == Math.ceil((data.tourney.manager.bestOF + 1) / 2))
                    setWinnerTeam(roundStatus.left < 0 ? null : json.teamList[roundStatus.left]);
                else if (data.tourney.manager.stars.right == Math.ceil((data.tourney.manager.bestOF + 1) / 2))
                    setWinnerTeam(roundStatus.right < 0 ? null : json.teamList[roundStatus.right]);
                else setWinnerTeam(null);

                setSocketData(data);
            }
        },
    });

    const wsController = useWebSocket("ws://localhost:3727/ws", {
        onOpen: () => {
            console.log("Controller Connected");
            askForInitialData();
        },
        onMessage: (event) => {
            if (event.data[0] !== "{") return;
            const mes = JSON.parse(event.data);

            switch (mes.type) {
                case "setInitialData":
                    setRoundStatus(mes.data);
                    break;
            }
        },
        shouldReconnect: (closeEvent) => true,
    });

    const askForInitialData = () => {
        wsController.sendJsonMessage({ type: "fetchInitRoundData" }, false);
    };

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
        document.title = "Resurrection Cup Winner";
        loadJsonData();
        const interval = setInterval(loadJsonData, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return JSON.stringify(json) !== "{}" ? (
        <div id="App">
            <div id="winner">
                <Particles className="particles" init={particlesInit} loaded={particlesLoaded} options={particlesJson} />
                <div className="content">
                    <img src="./Logo.png" />
                    <div className="teamInfo">
                        <div
                            className="teamIcon"
                            style={{
                                backgroundImage: winnerTeam ? `url(./team/${winnerTeam.teamIconURL})` : "",
                            }}
                        ></div>
                        <div className="teamNameContainer">
                            <div className="round">Resurrection Cup - {roundStatus.name}</div>
                            <div
                                className={`teamName ${
                                    winnerTeam?.teamName === json.team?.left ? "left" : winnerTeam?.teamName === json.team?.right ? "right" : ""
                                }`}
                            >
                                {winnerTeam?.teamName}
                            </div>
                            <div className="decorator">
                                <div className="line"></div>
                                winner
                            </div>
                        </div>
                    </div>
                    <div className="teamList">
                        {winnerTeam
                            ? winnerTeam?.playerList.playerName.map((name, idx) => {
                                  return (
                                      <div className="player" key={idx}>
                                          {name !== "" ? (
                                              <>
                                                  <div
                                                      className="playerIcon"
                                                      style={{
                                                          backgroundImage: `url(https://a.ppy.sh/${winnerTeam.playerList.playerID[idx]})`,
                                                      }}
                                                  ></div>
                                                  <div className="playerName">{name}</div>
                                              </>
                                          ) : (
                                              ""
                                          )}
                                      </div>
                                  );
                              })
                            : ""}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
};

export default Winner;
