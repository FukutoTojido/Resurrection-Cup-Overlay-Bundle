import { useContext } from "react";

import "./css/Player.css";
// import jsonData from "../../../../public/config.json"

import { ControllerDataContext } from "../Mappool";

const Team = (props) => {
    const { json } = useContext(ControllerDataContext)
    return (
        <div className={`team ${props.pos}`}>
            <div
                className="icon"
                style={{
                    backgroundImage: `url("./team/${json.teamList.filter((t) => t.teamName === json.team[props.pos]).shift().teamIconURL}")`,
                }}
            ></div>
            <div className="nameStar">
                <div className="name">{json.team[props.pos]}</div>
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
            </div>
        </div>
    );
};

const Star = (props) => {
    return <div className={`star ${props.isEven ? "even" : "odd"}`}></div>;
};

const PlayerScore = (props) => {
    return (
        <div className={`playerScoreContainer ${props.pos}`}>
            {[...Array(props.maxScore).keys()].map((idx) => (
                <Star key={idx} isEven={idx % 2 === 0} />
            ))}
        </div>
    );
};

const PlayerInfo = (props) => {
    return (
        <div className={`playerInfo ${props.pos}`}>
            <PlayerAvatar />
            <div className="playerName">{props.playerName}</div>
            <PlayerScore maxScore={5} pos={props.pos} />
            <div className="separator"></div>
        </div>
    );
};

const PlayerAvatar = (props) => {
    return <div className="playerAvatar"></div>;
};

const Player = () => {
    const { socketData } = useContext(ControllerDataContext);

    return (
        <div id="playerContainer">
            {/* <PlayerInfo pos="left" playerId={8266808} playerName="[Boy]DaLat" />
            <PlayerInfo pos="right" playerId={8266808} playerName="[Boy]DaLat" /> */}
            <Team pos="left" socketData={socketData}/>
            <Team pos="right" socketData={socketData}/>
            <img src="./Logo.png" />
        </div>
    );
};

export default Player;
