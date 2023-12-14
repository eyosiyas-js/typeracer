import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Input,
  Typography,
  formControlLabelClasses,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { roomSelector } from "../redux/roomSlice";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { gql, useSubscription } from "@apollo/client";

const NEW_PARAGRAPH_SUBSCRIPTION = gql`
  subscription NewParagraph($roomId: ID!) {
    newParagraph(roomId: $roomId) {
      Paragraph
    }
  }    
`;
const NEW_USER_SUBSCRIPTION = gql`
  subscription newUser($roomId: String!) {
    newUser(roomId: $roomId) {
      ID:String
      username:String!
    }
  }
`;

function RacingPage() {
  const room = useSelector(roomSelector);
  const navigation = useNavigate();
  const { id } = useParams();
  const [CarImages, setCarImages] = useState([]);

  const { data, loading, error } = useSubscription(NEW_PARAGRAPH_SUBSCRIPTION);
  const { Userdata, Userloading, Usererror } = useSubscription(
    NEW_USER_SUBSCRIPTION
  );

  useEffect(() => {
    if (room && room.ID === id) {
      const updatedCarImages = room.members.map((member, index) => ({
        uri: `/static/cars/car_${index}.png`,
        ID: member.ID,
        margin: 0,
      }));
      setCarImages(updatedCarImages);
    } else {
      navigation("/");
    }
  }, [room, id]); // Make sure to include room and id in the dependency array

  const [initialText, setInitialText] = useState(
    `That's great news! It seems like your local branch 'main' is already to date with the remote branch 'origin/main'`
  );

  const [value, setValue] = useState(initialText);
  const [value2, setValue2] = useState(initialText);
  const [rightChar, setRightChar] = useState([]);
  const [TextLength, setTextLength] = useState(null);
  const [freeze, setFreez] = useState(false);
  const [inputType, setInputType] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (value2 == "") {
      const updatedCarImages = CarImages.map((car, index) => ({
        ...car,
        margin: 0,
      }));
      setCarImages(updatedCarImages);
    }
    console.log(value2);
  }, [value2]);

  useEffect(() => {
    if (data) setInitialText(data);
  }, [data]);

  useEffect(() => {
    if (Userdata) alert(data);
  }, [Userdata]);

  const handleInputChange = (event) => {
    if (event.nativeEvent.inputType == "insertText") {
      setInputType("yes");
      console.log("yes");
    } else {
      setInputType("no");
      setFreez(false);

      // const updatedCarImages = CarImages.map((car, index) => ({
      //   ...car,
      //   margin: TextLength ? car.margin - 540 / TextLength : 0,
      // }));
      // setCarImages(updatedCarImages);
    }
    setValue2(event.target.value);

    const inputValue = event.target.value;
    const coloredText = Array.from(initialText).map((char, index) => {
      if (index < inputValue.length) {
        const inputChar = inputValue[index];
        const initialChar = char;
        const initialChasr = initialText.split("");
        const correctChars = initialChasr.filter(
          (char, index) => char === inputValue[index]
        );
        setRightChar(correctChars);

        if (inputChar === initialChar) {
          // if (event.nativeEvent.inputType == "insertText") {
          //   if (!freeze) {
          //   }
          // } else {
          //   if (!freeze) {
          //     const updatedCarImages = CarImages.map((car, index) => ({
          //       ...car,
          //       margin: TextLength ? car.margin - 540 / TextLength : 0,
          //     }));
          //     setCarImages(updatedCarImages);
          //   }
          // }
          // console.log(char);

          return (
            <span key={index} style={{ color: "green" }}>
              {char}
            </span>
          );
        }

        setFreez(true);

        return (
          <span key={index} style={{ color: "red" }}>
            {char}
          </span>
        );
      }
      return char;
    });

    setValue(
      <Typography sx={{ fontSize: "23px", fontWeight: "medium" }}>
        {coloredText}
      </Typography>
    );
  };

  useEffect(() => {
    console.log(rightChar);
    CarImages.map((value) => {
      console.log(value.margin);
    });
    if (
      CarImages.some((value) => value.margin >= 540) &&
      rightChar.length >= TextLength
    ) {
      alert("Done!");
    }
  }, [CarImages]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      if (inputType === "yes" && !freeze) {
        let Len = Array.from(initialText).length;
        const updatedCarImages = CarImages.map((car, index) => ({
          ...car,
          margin: car.ID === user.ID && car.margin + 540 / Len,
        }));
        setCarImages(updatedCarImages);
      } else if (!freeze) {
        let Len = Array.from(initialText).length;
        const updatedCarImages = CarImages.map((car, index) => ({
          ...car,
          margin: car.ID === user.ID && car.margin - 540 / Len,
        }));
        setCarImages(updatedCarImages);
      }
      console.log(inputType);
    } else {
      isFirstRender.current = false;
    }
  }, [rightChar]);

  if (CarImages.length == 0) {
    return <CircularProgress />;
  }
  return (
    <Grid
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Car images */}
      {CarImages.map(({ uri, margin }, index) => (
        <Grid
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "650px",
          }}
        >
          <img
            style={{
              width: "90px",
              backgroundColor: "red",
              height: "50px",
              marginLeft: margin,
            }}
            src={uri}
            alt={`Car ${index}`}
          />
          {/* Placeholder image, replace with your car image */}
          <img
            style={{ width: "20px" }}
            src={"/static/cars/win.png"}
            alt={`Placeholder ${index}`}
          />
        </Grid>
      ))}

      {/* Displayed text */}
      <Box
        sx={{
          width: "600px",
          padding: 4,
          borderRadius: "12px",
          border: "1px solid gray",
          mt: 10,
          fontSize: "23px",
        }}
      >
        {value}
      </Box>

      {/* Input field */}
      <Box sx={{ width: "600px", mt: 8 }}>
        <Input
          sx={{ fontSize: "23px", fontWeight: "medium" }}
          fullWidth
          multiline
          onChange={handleInputChange}
        />
      </Box>
      {user.ID === room.owner && <Button>Start</Button>}
    </Grid>
  );
}

export default RacingPage;
