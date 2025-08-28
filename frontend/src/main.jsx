import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="645149785980-1saq7on4upvt1vucng3cggev41s0l6gn.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);


// import { createRoot } from 'react-dom/client';
// import App from './App';
// import './index.css';

// createRoot(document.getElementById("root")).render(<App />);
