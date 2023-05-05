import React, { useEffect, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";

import { InviteIcon } from "../assets";

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }
    setSelected((prevSelected) => !prevSelected);
  };

  const ChannelPreview = () => (
    <div className="channel-preview__item">
      <Avatar image={user.image} name={user.fullName || user.id} size={32} />
      <p className="channel-preview__item-name">{user.fullName || user.id}</p>
    </div>
  );

  return (
    <div
      className="user-item__wrapper"
      onClick={() => setSelected((prevSelected) => !prevSelected)}
    >
      <div className="user-item__name-wrapper">
        <ChannelPreview />
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
};

const UserList = ({ setSelectedUsers }) => {
  const { client } = useChatContext();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);

  useEffect(() => {
    if (client) getUsers();
  }, []);

  const getUsers = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await client.queryUsers(
        { id: { $ne: client.userID } },
        { id: 1 },
        { limit: 8 }
      );
      if (response.users.length) {
        setUser(response.users);
      } else {
        setListEmpty(true);
      }
      //   const data = await response.json();
      //   setUser(data);
      setLoading(false);
    } catch (error) {
      setError(true);
      console.log(error);
    }
    setLoading(false);
  };

  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">
          Error loading, please refresh and try again
        </div>
      </ListContainer>
    );
  }
  if (listEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">No users found</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message">Loading users...</div>
      ) : (
        user?.map((user, i) => (
          <UserItem
            index={i}
            key={user.id}
            user={user}
            setSelectedUsers={setSelectedUsers(user.id)}
          />
        ))
      )}
    </ListContainer>
  );
};

export default UserList;
