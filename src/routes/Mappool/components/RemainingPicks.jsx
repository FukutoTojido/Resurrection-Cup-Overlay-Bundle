import { useContext, useEffect, useState } from "react";

import "./css/RemainingPicks.css";
import jsonData from "../../../../public/config.json";

import { ControllerDataContext } from "../Mappool";

const RemainingPicks = () => {
    const { controllerData } = useContext(ControllerDataContext);
    const [pickedMaps, setPickedMaps] = useState([]);

    useEffect(() => {
        const currentPickedMaps = ["left", "right"].reduce((accumulated, pos) => {
            return accumulated.concat(
                ["ban", "pick"].reduce((arr, type) => {
                    return arr.concat(controllerData.status.poolStatus[pos][type].map((map) => map.mapIndex).filter((m) => m));
                }, [])
            );
        }, []);

        setPickedMaps(currentPickedMaps)
    }, [JSON.stringify(controllerData.status.poolStatus)]);

    return (
        <div id="remainingPicks">
            <div className="remainLabel">Remaining Picks</div>
            {Object.keys(jsonData.pool).map((mod) => {
                if (mod === "TB") return ""
                return (
                    <div className="modContainer" key={mod}>
                        {jsonData.pool[mod].map((map, idx) => {
                            return <div className={`mapNode ${mod} ${pickedMaps.includes(`${mod}${idx + 1}`) ? "picked" : ""}`} key={idx}>{`${mod}${idx + 1}`}</div>
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default RemainingPicks;
