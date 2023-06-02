import { useEffect, useState, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import "./Winner.css";

import jsonData from "../../../public/config.json";
import particlesJson from "../../../public/particles.json";

const Winner = () => {
    const [socketData, setSocketData] = useState({});
    const [winnerTeam, setWinnerTeam] = useState(null);

    const ws = useWebSocket("ws://127.0.0.1:24050/ws", {
        onOpen: () => {
            console.log("WebSocket Connected!");
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);

            if (JSON.stringify(data.tourney.manager.stars) !== JSON.stringify(socketData.tourney?.manager.stars)) {
                if (data.tourney.manager.stars.left == Math.ceil((data.tourney.manager.bestOF + 1) / 2))
                    setWinnerTeam(jsonData.teamList.filter((t) => t.teamName === jsonData.team.left).shift());
                else if (data.tourney.manager.stars.right == Math.ceil((data.tourney.manager.bestOF + 1) / 2))
                    setWinnerTeam(jsonData.teamList.filter((t) => t.teamName === jsonData.team.right).shift());
                else setWinnerTeam(null);

                setSocketData(data);
            }
        },
    });

    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {}, [])

    useEffect(() => {
        document.title = "Resurrection Cup Winner"
    }, [])

    return (
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
                            <div className="round">Resurrection Cup - {jsonData.round}</div>
                            <div
                                className={`teamName ${
                                    winnerTeam?.teamName === jsonData.team.left ? "left" : winnerTeam?.teamName === jsonData.team.right ? "right" : ""
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
                                          <div
                                              className="playerIcon"
                                              style={{
                                                  backgroundImage: `url(https://a.ppy.sh/${winnerTeam.playerList.playerID[idx]})`,
                                              }}
                                          ></div>
                                          <div className="playerName">{name}</div>
                                      </div>
                                  );
                              })
                            : ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Winner;
