import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import "../App.css";
import "stream-chat-react/dist/css/index.css";

import { ChannelContainer, ChannelListContainer, Auth } from "./";

const apiKey = "nf9m7nm6d9k6";
const client = StreamChat.getInstance(apiKey);
const cookies = new Cookies();

function Home() {
  const authToken = cookies.get("token");
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (authToken) {
      client.connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          fullName: cookies.get("fullName"),
          image: cookies.get("avatarURL"),
          phoneNumber: cookies.get("phoneNumber"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        authToken
      );
    }
  }, [authToken]);

  if (!authToken) return <Auth />;
  return (
    <div className="app__wrapper">
      <Chat client={client} theme="team light ">
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
        />
      </Chat>
    </div>
  );
}

export default Home;
