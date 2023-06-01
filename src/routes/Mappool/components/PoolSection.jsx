import { useContext, useState, useEffect } from "react";

import "./css/PoolSection.css";

import { ControllerDataContext } from "../Mappool";
import jsonData from "../../../../public/config.json";

const BanNode = (props) => {
    const { controllerData } = useContext(ControllerDataContext);
    const [rowData, setRowData] = useState(controllerData.status.poolStatus[props.pos][props.type][props.idx]);

    useEffect(() => {
        setRowData(controllerData.status.poolStatus[props.pos][props.type][props.idx]);
    }, [JSON.stringify(controllerData.status.poolStatus[props.pos][props.type][props.idx])]);

    return (
        <div className={`banNode ${JSON.stringify(rowData) !== "{}" ? "banned" : ""}`}>
            {JSON.stringify(rowData) !== "{}" ? (
                <>
                    <div
                        className="image"
                        style={{
                            backgroundImage: `url(${rowData.beatmapData.coverURL})`,
                        }}
                    ></div>
                    <div className={`modsFlair ${rowData.mapIndex.slice(0, 2)}`}>{rowData.mapIndex}</div>
                </>
            ) : (
                "To be banned"
            )}
        </div>
    );
};

const PickingRow = (props) => {
    const { controllerData } = useContext(ControllerDataContext);
    const [rowData, setRowData] = useState(controllerData.status.poolStatus[props.pos][props.type][props.idx]);

    useEffect(() => {
        setRowData(controllerData.status.poolStatus[props.pos][props.type][props.idx]);
    }, [JSON.stringify(controllerData.status.poolStatus[props.pos][props.type][props.idx])]);

    return (
        <div className="row">
            <div className={`pickNode ${JSON.stringify(rowData) !== "{}" ? "picked" : ""}`}>
                {JSON.stringify(rowData) !== "{}" ? (
                    <>
                        <div className={`winner ${rowData.winner}`}>
                            <div className="iconWrapper">
                                <div
                                    className="icon"
                                    style={{
                                        backgroundImage:
                                            rowData.winner !== "none"
                                                ? `url(/team/${
                                                      jsonData.teamList.filter((t) => t.teamName === jsonData.team[rowData.winner]).shift()
                                                          .teamIconURL
                                                  })`
                                                : "",
                                    }}
                                ></div>
                            </div>
                            <img src="./trophy.png" />
                        </div>
                        <div
                            className="image"
                            style={{
                                backgroundImage: `url(${rowData.beatmapData.coverURL})`,
                            }}
                        ></div>
                        <div className="mapInfoContainer">
                            <div className="metadata">
                                <div className="artistTitle">
                                    {rowData.beatmapData.artist} - {rowData.beatmapData.title}
                                </div>
                                <div className="diffMapper">
                                    [{rowData.beatmapData.diff}] - Mapped by {rowData.beatmapData.creator}
                                </div>
                            </div>
                            <div className={`modsFlair ${rowData.mapIndex.slice(0, 2)}`}>{rowData.mapIndex}</div>
                        </div>
                    </>
                ) : (
                    "To be picked"
                )}
            </div>
        </div>
    );
};

const PoolCol = (props) => {
    const { controllerData } = useContext(ControllerDataContext);

    return (
        <div className={`poolCol ${props.pos}`}>
            <div className="row">
                {controllerData.status.poolStatus[props.pos].ban.map((ban, idx) => (
                    <BanNode pos={props.pos} type="ban" idx={idx} data={ban} key={idx} />
                ))}
            </div>
            {controllerData.status.poolStatus[props.pos].pick.map((pick, idx) => (
                <PickingRow pos={props.pos} type="pick" idx={idx} data={pick} key={idx} />
            ))}
        </div>
    );
};

const Separator = () => {
    const { controllerData } = useContext(ControllerDataContext);

    return (
        <div className="poolSeparator">
            <div
                className={`indicator ${controllerData.status.naviStatus.team}`}
                style={{
                    top: `${controllerData.status.naviStatus.pos * 80}px`,
                }}
            >
                <div className="leftArrow"></div>
                {controllerData.status.naviStatus.phase}
                <div className="rightArrow"></div>
            </div>
        </div>
    );
};

const TieBreakRow = () => {
    const { controllerData } = useContext(ControllerDataContext);
    const [rowData, setRowData] = useState(controllerData.status.poolStatus.tb.pick[0]);

    useEffect(() => {
        setRowData(controllerData.status.poolStatus.tb.pick[0]);
    }, [JSON.stringify(controllerData.status.poolStatus.tb.pick[0])]);

    return (
        <div className="row tb">
            <div className={`pickNode ${JSON.stringify(rowData) !== "{}" ? "picked" : ""}`}>
                {JSON.stringify(rowData) !== "{}" ? (
                    <>
                        <div
                            className="image"
                            style={{
                                backgroundImage: `url(${rowData.beatmapData.coverURL})`,
                            }}
                        ></div>
                        <div className="mapInfoContainer">
                            <div className={`modsFlair ${rowData.mapIndex.slice(0, 2)}`}>{rowData.mapIndex}</div>
                            <div className="metadata">
                                <div className="artistTitle">
                                    {rowData.beatmapData.artist} - {rowData.beatmapData.title}
                                </div>
                                <div className="diffMapper">
                                    [{rowData.beatmapData.diff}] - Mapped by {rowData.beatmapData.creator}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    "To be picked"
                )}
            </div>
        </div>
    );
};

const PoolSection = () => {
    return (
        <div id="poolSection">
            <PoolCol pos="left" />
            <Separator />
            <PoolCol pos="right" />
            <TieBreakRow />
        </div>
    );
};

export default PoolSection;
