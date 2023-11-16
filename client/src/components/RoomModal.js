import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Alert, FormControl, Snackbar, TextField } from "@mui/material";
import { CREATE_ROOM_MUTATION, JOIN_ROOM_MUTATION } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { addRoom } from "../redux/roomSlice";

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
  const [createROOM] = useMutation(CREATE_ROOM_MUTATION);
  const [joinROOM] = useMutation(JOIN_ROOM_MUTATION);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

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
    console.log(name, password);
    // Your form submission logic here
    if (type === "create") {
      createROOM({ variables: { name, password } })
        .then((response) => {
          setOpenSnakBar(true);
          dispatch(addRoom(response.data));
        })
        .catch((err) => {
          setError("Error creating room");
          console.log(err);
        });
    } else {
      joinROOM({ variables: { name, password } })
        .then((response) => {
          setOpenSnakBar(true);
          dispatch(addRoom(response.data.joinRoom));
        })
        .catch((err) => {
          setError("Error joining room");
          console.log(err.message);
        });
    }
    // Trigger rocket animation when the button is clicked
    handleRocketFly();
  };

  const [openSnakBar, setOpenSnakBar] = React.useState(false);

  const handleCloseSnakBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnakBar(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
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
            <TextField
              placeholder="Room name"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              sx={{ mt: 2 }}
              placeholder="Room password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
      <Snackbar
        open={openSnakBar}
        autoHideDuration={6000}
        onClose={handleCloseSnakBar}
      >
        <Alert
          onClose={handleCloseSnakBar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {type === "create"
            ? "Room Created Successfully"
            : "Room Joined Successfully!!"}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
