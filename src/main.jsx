import React from "react";
import ReactDOM from "react-dom/client";
import Overlay from "./routes/Overlay/Overlay.jsx";
import Showcase from "./routes/Showcase/Showcase.jsx";
import Winner from "./routes/Winner/Winner.jsx";
import Mappool from "./routes/Mappool/Mappool.jsx";

import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HashRouter hashType="noslash">
            <Routes>
                <Route exact path="/" element={<Overlay />} />
                <Route path="/showcase" element={<Showcase />} />
                <Route path="/winner" element={<Winner />} />
                <Route path="/mappool" element={<Mappool />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>
);
