import React, { useState } from "react";
import "./App.css";
import { Modal } from "antd";
import Parse from "parse";

export const MemberList = (props) => {
  // State variable to hold input values and flags
  const [isChannelInviteModalVisible, setIsChannelInviteModalVisible] =
    useState(false);
  const [channelInviteInput, setChannelInviteInput] = useState("");
  const [isChannelDeleteModalVisible, setIsChannelDeleteModalVisible] =
    useState(false);
  const [isChannelLeaveModalVisible, setIsChannelLeaveModalVisible] =
    useState(false);

  // Shows modal
  const showChannelInviteModal = () => {
    setIsChannelInviteModalVisible(true);
  };

  // Clears input and hide modal on cancel
  const handleChannelInviteModalCancel = () => {
    setChannelInviteInput("");
    setIsChannelInviteModalVisible(false);
  };

  // Invites an user to this channel
  const doInviteChannel = async () => {
    const username = channelInviteInput;

    if (username === "") {
      alert("Please inform the invited username!");
      return false;
    }

    // Query for an user with the informed username
    const invitedUserQuery = new Parse.Query(Parse.User);
    invitedUserQuery.equalTo("username", username);
    try {
      // Use .first() to resolve this query to force undefined result if
      // couldn't find any result on server
      const invitedUser = await invitedUserQuery.first();
      if (invitedUser === undefined) {
        return false;
      }

      const Channel = props.currentChannel;
      // Check if user is already in members
      if (
        Channel.get("members").find(
          (member) => member.id === invitedUser.id
        ) !== undefined
      ) {
        alert("This user already is a member of this channel!");
        return false;
      }

      // Adds invitedUser object to the members array
      Channel.add("members", invitedUser);

      // Clears input and hides modal
      setChannelInviteInput("");
      setIsChannelInviteModalVisible(false);

      try {
        await Channel.save();
        alert(`Success on inviting ${username} to this channel!`);
        return true;
      } catch (error) {
        alert(error);
        return false;
      }
    } catch (error) {
      alert(error);
      return false;
    }
  };

  // Shows modal
  const showChannelDeleteModal = () => {
    setIsChannelDeleteModalVisible(true);
  };

  // Hides modal on cancel
  const handleChannelDeleteModalCancel = () => {
    setIsChannelDeleteModalVisible(false);
  };

  // Delete channel if the current user is its owner
  const doDeleteChannel = async () => {
    const Channel = props.currentChannel;
    // Hides modal
    setIsChannelInviteModalVisible(false);

    try {
      // Deletes channel for server, but the local instance is kept
      // on the Channel const variable, so we can still use it in this scope
      await Channel.destroy();
      // Query for messages inside the deleted channel
      const messageQuery = new Parse.Query("Message");
      messageQuery.equalTo("channel", Channel.toPointer());
      try {
        const messages = await messageQuery.find();
        // Deletes every result on the Message query
        for (let message of messages) {
          await message.destroy();
        }
        alert(`Success on deleting channel ${Channel.get("name")}!`);
        // Calls the callback from Home that deactivates the current channel
        // and "kills" this instance of the component
        props.closeChannelCallback();
        return true;
      } catch (error) {
        alert(error);
        return false;
      }
    } catch (error) {
      alert(error);
      return false;
    }
  };

  // Shows the modal
  const showChannelLeaveModal = () => {
    setIsChannelLeaveModalVisible(true);
  };

  // Hides the modal on cancel
  const handleChannelLeaveModalCancel = () => {
    setIsChannelLeaveModalVisible(false);
  };

  // Leaves the current channel if current user is not the owner
  const doLeaveChannel = async () => {
    const Channel = props.currentChannel;
    // .remove() is the opposite of .add(), so the current user pointer
    // will be removed from the channel members array
    Channel.remove("members", props.currentUser.toPointer());

    // Hides modal
    setIsChannelLeaveModalVisible(false);

    try {
      // Saves the channel changes
      const saveResult = await Channel.save();
      // Query for messages belonging to this user inside the channel
      const messageQuery = new Parse.Query("Message");
      messageQuery.equalTo("user", props.currentUser.toPointer());
      try {
        const messages = await messageQuery.find();
        // Deletes every resulted message
        for (let message of messages) {
          await message.destroy();
        }
        alert(`Success on leaving channel ${saveResult.get("name")}!`);
        // Calls the callback from Home that deactivates the current channel
        // and "kills" this instance of the component
        props.closeChannelCallback();
        return true;
      } catch (error) {
        alert(error);
        return false;
      }
    } catch (error) {
      alert(error);
      return false;
    }
  };

  return (
    <>
      <div>
        {props.currentUser.id === props.currentChannel.get("owner").id ? (
          <>
            <div className="info-header" onClick={showChannelInviteModal}>
              <p className="info-header__label">Members</p>
              <svg
                className="info-header__icon"
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
            <Modal
              title="Invite user to channel"
              visible={isChannelInviteModalVisible}
              onOk={doInviteChannel}
              onCancel={handleChannelInviteModalCancel}
              okText={"Invite"}
            >
              <>
                <label>{"Username to invite"}</label>
                <input
                  type={"text"}
                  value={channelInviteInput}
                  placeholder={"Username to invite"}
                  onChange={(event) =>
                    setChannelInviteInput(event.target.value)
                  }
                ></input>
              </>
            </Modal>
          </>
        ) : (
          <>
            <div className="info-header" onClick={showChannelInviteModal}>
              <p className="info-header__label">Members</p>
            </div>
          </>
        )}
        <ul className="info-members">
          {props.currentChannel.get("members") && (
            <p>
              {props.currentChannel
                .get("members")
                .map((result) => `${result.getUsername()}`)
                .join(", ")}
            </p>
          )}
        </ul>
      </div>
      {props.currentUser.id === props.currentChannel.get("owner").id ? (
        <>
          <div className="info-buttons">
            <button
              className="info-button info-button--red"
              onClick={showChannelDeleteModal}
            >
              <span className="info-button__label">Delete channel</span>
              <svg
                className="info-button__icon"
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
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
          <Modal
            title="Delete channel"
            visible={isChannelDeleteModalVisible}
            onOk={doDeleteChannel}
            onCancel={handleChannelDeleteModalCancel}
            okText={"Yes"}
          >
            <p>
              {
                "Are you sure that you want to delete this channel? All messages in it will be deleted!"
              }
            </p>
          </Modal>
        </>
      ) : (
        <>
          <button className="info-button" onClick={showChannelLeaveModal}>
            <span className="info-button__label">Leave channel</span>
            <svg
              className="info-button__icon"
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
          <Modal
            title="Leave channel"
            visible={isChannelLeaveModalVisible}
            onOk={doLeaveChannel}
            onCancel={handleChannelLeaveModalCancel}
            okText={"Yes"}
          >
            <p>
              {
                "Are you sure that you want to leave this channel? All your messages in it will be deleted!"
              }
            </p>
          </Modal>
        </>
      )}
    </>
  );
};
