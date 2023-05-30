import "./css/NowPlaying.css"

const NowPlaying = (props) => {
    return (
        <div className="nowPlaying">
            <div className="mapBG">
                <div className="wrapper">
                    <img
                        src={`http://127.0.0.1:24050/Songs/${props.socketData.menu.bm.path.full
                            .replace(/%/g, "%25")
                            .replace(/#/g, "%23")
                            .replace(/\\/g, "/")
                            .replace(/'/g, "%27")}`}
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="stats">
                        <div className="rawStats">
                            <div className="stat">
                                CS <span>{props.mapStat.CS}</span>
                            </div>
                            /
                            <div className="stat">
                                AR <span>{props.mapStat.AR}</span>
                            </div>
                            /
                            <div className="stat">
                                OD <span>{props.mapStat.OD}</span>
                            </div>
                            /
                            <div className="stat">
                                BPM <span>{props.mapStat.BPM}</span>
                            </div>
                        </div>
                        <div className="starRating">
                            <div className="stat">
                                Star Rating <span>{props.mapStat.SR}★</span>
                            </div>
                        </div>
                    </div>
                    <div className="info">
                        <div className="artistTitle">
                            {props.socketData.menu.bm.metadata.artist} - {props.socketData.menu.bm.metadata.title}
                        </div>
                        <div className="diffMapper">
                            [{props.socketData.menu.bm.metadata.difficulty}] - Mapped by {props.socketData.menu.bm.metadata.mapper}
                        </div>
                    </div>
                    <div className={`mod ${props.modId.slice(0, 2)}`}>{props.modId}</div>
                </div>
            </div>
        </div>
    );
};

export default NowPlaying