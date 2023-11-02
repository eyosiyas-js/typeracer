import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FormControl, TextField } from "@mui/material";

const style = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const rocketStyle = {
  marginRight: 50,
  paddingTop: 20,
  animation: "rocketMotion 1s infinite alternate",
};

const rocketKeyframes = {
  "0%": {
    transform: "translateY(0)",
  },
  "50%": {
    transform: "translateY(-10px)",
  },
  "100%": {
    transform: "translateY(0)",
  },
};

export default function RoomModal({ open, handleClose, type }) {
  const [rocketAnimation, setRocketAnimation] = useState(rocketStyle);
  useEffect(() => {
    setRocketAnimation(rocketStyle);
    console.log("hi");
  }, []);

  const handleRocketFly = () => {
    setRocketAnimation({
      ...rocketStyle,
      animationName: "rocketFly",
      animationDuration: "1s",
      animationIterationCount: "1",
      animationDirection: "normal",
    });
  };

  const handleFormSubmit = (e) => {
    // Your form submission logic here
    console.log("hi");
    // Trigger rocket animation when the button is clicked
    handleRocketFly();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <Typography variant="h5" sx={{ mb: 1, ml: 1 }}>
              {type === "create" ? "Create Room" : "Join Room"}
            </Typography>
            <TextField placeholder="Room name" type="name" />
            <TextField
              sx={{ mt: 2 }}
              placeholder="Room password"
              type="password"
            />
            <Button
              variant="contained"
              sx={{ ml: 10, mt: 2 }}
              onClick={handleFormSubmit}
            >
              {type === "join" ? "Join" : "Create"}
            </Button>
          </div>

          <Box sx={{}}>
            <img
              src="https://static.vecteezy.com/system/resources/previews/009/394/204/non_2x/rocket-spaceship-clipart-design-illustration-free-png.png"
              alt="rocket"
              width={70}
              style={{
                ...rocketAnimation,
              }}
            />
            <style>
              {`
              @keyframes rocketMotion {
                0% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-10px);
                }
                100% {
                  transform: translateY(0);
                }
              }

              @keyframes rocketFly {
                0% {
                  transform: translateY(0);
                }
                100% {
                  transform: translateY(-100px); // Change this value for the desired upward motion
                }
              }
            `}
            </style>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
