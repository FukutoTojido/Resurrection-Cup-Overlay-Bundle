import React from "react";
import ReactDOM from "react-dom/client";
import Overlay from "./routes/Overlay/Overlay.jsx";
import Showcase from "./routes/Showcase/Showcase.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider, HashRouter, Route, Routes } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Overlay />,
    },
    {
        path: "/showcase",
        element: <Showcase />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* <App /> */}
        <HashRouter hashType="noslash">
            {/* <RouterProvider router={router} /> */}
            <div>
                <Routes>
                    <Route exact path="/" element={<Overlay />} />
                    <Route path="/showcase" element={<Showcase />} />
                </Routes>
            </div>
        </HashRouter>
    </React.StrictMode>
);
