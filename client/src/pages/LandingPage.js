import React from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";

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

  return (
    <div className={classes.content}>
      <div className={classes.buttonContainer}>
        <Button variant="contained" color="inherit">
          Start Racing
        </Button>
        <Button variant="contained" color="inherit">
          Join Room
        </Button>
        <Button variant="contained" color="inherit">
          Create Room
        </Button>
      </div>
      <video className={classes.wallpaper} autoPlay muted loop>
        <source src="/static/key.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default LandingPage;
