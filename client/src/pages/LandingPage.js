import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import RoomModal from "../components/RoomModal";

const useStyles = makeStyles({
  wallpaper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -1,
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  buttonContainer: {
    display: "flex",
    gap: "40px",
    marginBottom: "500px",
  },
});

function LandingPage() {
  const classes = useStyles();
  const [isRoomModalOpen, setRoomModalOpen] = useState({
    state: false,
    type: null,
  });

  const openRoomModal = () => {
    setRoomModalOpen({
      state: true,
      type: "create",
    });
  };

  const joinRoomModal = () => {
    setRoomModalOpen({
      state: true,
      type: "join",
    });
  };

  const closeRoomModal = () => {
    setRoomModalOpen({
      state: false,
      type: "",
    });
  };

  return (
    <div className={classes.content}>
      <div className={classes.buttonContainer}>
        <Button variant="contained" color="inherit">
          Start Racing
        </Button>
        <Button onClick={joinRoomModal} variant="contained" color="inherit">
          Join Room
        </Button>
        <Button onClick={openRoomModal} variant="contained" color="inherit">
          Create Room
        </Button>
      </div>
      <video className={classes.wallpaper} autoPlay muted loop>
        <source src="/static/key.mp4" type="video/mp4" />
      </video>
      {isRoomModalOpen.state && (
        <RoomModal
          open={isRoomModalOpen.state}
          handleClose={closeRoomModal}
          type={isRoomModalOpen.type}
        />
      )}
    </div>
  );
}

export default LandingPage;
