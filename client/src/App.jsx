import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import { ChannelContainer, ChannelListContainer, Auth } from "./components";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={"/"} element={<Home />} />
      <Route path={"/login"} element={<Login />} />
      <Route path={"/register"} element={<Auth />} />
    </Routes>
  );
}

export default App;
