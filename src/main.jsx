import React from "react";
import ReactDOM from "react-dom/client";
import Overlay from "./routes/Overlay/Overlay.jsx";
import Showcase from "./routes/Showcase/Showcase.jsx";
import Winner from "./routes/Winner/Winner.jsx";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HashRouter hashType="noslash">
            <div>
                <Routes>
                    <Route exact path="/" element={<Overlay />} />
                    <Route path="/showcase" element={<Showcase />} />
                    <Route path="/winner" element={<Winner />} />
                </Routes>
            </div>
        </HashRouter>
    </React.StrictMode>
);
