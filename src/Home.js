import React, { useEffect, useState } from "react";
import "./App.css";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
import Parse from "parse";
import { ChannelList } from "./ChannelList";
import { MessageList } from "./MessageList";
import { MemberList } from "./MemberList";

export const Home = () => {
  const history = useHistory();

  // State variables holding input values and flags
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreateChannelModalVisible, setIsCreateChannelModalVisible] =
    useState(false);
  const [createChannelInput, setCreateChannelInput] = useState("");
  const [currentChannel, setCurrentChannel] = useState(null);

  // This effect hook runs at every render and checks if there is a
  // logged in user, redirecting to Login screen if needed
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await Parse.User.currentAsync();
        if (user === null || user === undefined) {
          history.push("/");
        } else {
          if (currentUser === null) {
            setCurrentUser(user);
          }
        }
        return true;
      } catch (_error) {}
      return false;
    };
    checkCurrentUser();
  });

  // Logout function
  const doLogout = async () => {
    // Logout
    try {
      await Parse.User.logOut();
      // Force useEffect execution to redirect back to Login
      setCurrentUser(null);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  // Makes modal visible
  const showCreateChannelModal = () => {
    setIsCreateChannelModalVisible(true);
  };

  // Clear input and hide modal on cancel
  const handleCreateChannelModalCancel = () => {
    setCreateChannelInput("");
    setIsCreateChannelModalVisible(false);
  };

  // Creates a channel based on input from modal
  const doCreateChannel = async () => {
    const channelName = createChannelInput;

    if (channelName === "") {
      alert("Please inform your new channel name!");
      return false;
    }

    // Creates a new Parse.Object instance and set parameters
    const Channel = new Parse.Object("Channel");
    Channel.set("name", channelName);
    Channel.set("owner", currentUser);
    // Members is an array of Parse.User objects, so .add() should be used to
    // concatenate the value inside the array
    Channel.add("members", currentUser);

    // Clears input value and hide modal
    setCreateChannelInput("");
    setIsCreateChannelModalVisible(false);

    try {
      // Save object on Parse server
      const saveResult = await Channel.save();
      // Set the created channel as the active channel,
      // showing the message list for this channel
      setCurrentChannel(saveResult);
      alert(`Success on creating channel ${channelName}`);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  // Changes the active channel and shows the message list for it
  // This is called using a callback in the ChannelList component
  const doSelectChannel = (channel) => {
    setCurrentChannel(null);
    setCurrentChannel(channel);
  };

  // Settings current channel to null hides the message list component
  // This is called using a callback in the MessageList component
  const doClearCurrentChannel = () => {
    setCurrentChannel(null);
  };

  return (
    <div className="grid">
      <div className="organizations">
        <div className="organization">
          <picture className="organization__picture">
            <img
              className="organization__img"
              src="https://scontent.fsqx1-1.fna.fbcdn.net/v/t1.6435-9/29136314_969639596535770_8356900498426560512_n.png?_nc_cat=103&ccb=1-5&_nc_sid=973b4a&_nc_ohc=D9actPSB8DUAX-zaA7F&_nc_ht=scontent.fsqx1-1.fna&oh=96679a09c5c4524f0a6c86110de697b6&oe=618525F9"
              alt=""
            />
          </picture>
          <p className="organization__title">Back4App</p>
        </div>
        <button className="button-inline" onClick={doLogout}>
          <svg
            className="button-inline__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
          <span className="button-inline__label">Log out</span>
        </button>
      </div>
      <div className="channels">
        {/* Action buttons (new channel and logout) */}
        <div>
          <Modal
            title="Create new channel"
            visible={isCreateChannelModalVisible}
            onOk={doCreateChannel}
            onCancel={handleCreateChannelModalCancel}
            okText={"Create"}
          >
            <>
              <label>{"Channel Name"}</label>
              <input
                type={"text"}
                value={createChannelInput}
                placeholder={"New Channel Name"}
                onChange={(event) => setCreateChannelInput(event.target.value)}
              ></input>
            </>
          </Modal>
        </div>
        <div className="channels-header" onClick={showCreateChannelModal}>
          <p className="channels-header__label">Channels</p>
          <svg
            className="channels-header__icon"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
        {/* Channel list component, instantiated only when the user is successfully fetched */}
        {currentUser !== null && (
          <ChannelList
            currentUser={currentUser}
            selectChannelCallback={doSelectChannel}
          />
        )}
      </div>
      <div className="messages">
        {/* Message list component, instantiated only when there is a selected channel */}
        {currentUser !== null && currentChannel !== null && (
          <MessageList
            currentUser={currentUser}
            currentChannel={currentChannel}
            closeChannelCallback={doClearCurrentChannel}
          />
        )}
      </div>
      <div className="info">
        {/* Member list component, instantiated only when there is a selected channel */}
        {currentUser !== null && currentChannel !== null && (
          <MemberList
            currentUser={currentUser}
            currentChannel={currentChannel}
            closeChannelCallback={doClearCurrentChannel}
          />
        )}
      </div>
    </div>
  );
};
