import "./css/BottomSection.css";

import Chat from "./Chat";
import RemainingPicks from "./RemainingPicks";

const BottomSection = () => {
    return (
        <div id="bottomSection">
            <Chat />
            <RemainingPicks />
        </div>
    );
};

export default BottomSection;
