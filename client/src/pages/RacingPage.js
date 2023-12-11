import { Box, Grid, Input, Typography } from "@mui/material";
import React, { useState } from "react";

function RacingPage() {
  const initialText = `That's great news! It seems like your local branch 'main' is already
    up to date with the remote branch 'origin/main'. The message "nothing
    to commit, working tree clean" indicates that there are no changes in
    your working directory that haven't been committed`;

  const [value, setValue] = useState(initialText);
  const [freeze, setFreez] = useState(false);

  const handleInputChange = (event) => {
    if (event.nativeEvent.inputType == "insertText" && freeze) {
      return;
    } else setFreez(false);

    const inputValue = event.target.value;
    const coloredText = Array.from(initialText).map((char, index) => {
      if (index < inputValue.length) {
        const inputChar = inputValue[index];
        const initialChar = char;

        if (inputChar === initialChar) {
          if (event.nativeEvent.inputType == "insertText") {
            const updatedCarImages = CarImages.map((car, index) => ({
              ...car,
              margin: car.margin + 10 * index,
            }));
            setCarImages(updatedCarImages);
          } else {
            const updatedCarImages = CarImages.map((car, index) => ({
              ...car,
              margin: car.margin - 10 * index,
            }));
            if (!freeze) setCarImages(updatedCarImages);
          }

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

  const [CarImages, setCarImages] = useState([
    {
      uri: "/static/cars/car_1.png",

      margin: 20,
    },
    {
      uri: "/static/cars/car_2.png",

      margin: 20,
    },
    {
      uri: "/static/cars/car_3.png",

      margin: 20,
    },
    {
      uri: "/static/cars/car_4.png",

      margin: 20,
    },
  ]);
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
            style={{ width: "90px", height: "50px", marginLeft: margin }}
            src={uri}
            alt={`Car ${index}`}
          />
          {/* Placeholder image, replace with your car image */}
          <img
            style={{ width: "40px" }}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABAlBMVEX////7YS77VzX6UTn6TTx8i52ktr78ZSv7Xy/7XTH7WzL7VTb6Uzj6Tzv6Sz36R0D6SED5Q0OYqbSImKc/RVdJWWJCS1qesLmOnqyTpLCCkaKaq7b9ZSVFUV5HVWCGlqX+8O0+QlZ1hZjIztW1vcfK1dnTinjX3+K8xc36cG78fWX7d2n/7u+Pp7X8hmD8gWP+4+P7cU76Z1T9wcH5Ojv7cE77alL6Ylf6XFzp7fCtvsXi5+rUnI37eWf6bm/6fH7+09T6ZGf5LTH6dHX8uLj8rKz8np35T038lJP+29r7jInPjX39eEeCjpNZanFQVWd9gY0oLUaSlZ5SYmqur7ZeY3KJKfs6AAAEFUlEQVR4nO3d/VfSYBTAcdKAXlAcKAi+zRZBRS/WYwEWKFaYBWrq//+vtDE2npFyTrnbvffZ/Z7D8dd9zn324tg0lZIkSZIkSZIkSSJc2+l0Ok4bezPgcsoZr3INe0OgavhANwd7U2CqZabVsTcGonZHEzZM3BfrGb0D7M0BSF+kmbKJy1SE/BMh/0TIPxHyT4T8EyH/EiAsi5B7CVil5gsntxL9zBTqGSs0f5WaP8OwT6/D3kR7Me1z0MuZnkfrevUOSQkzzzbHZbPZe24Pxj10exS04PZ4Ui6XW/RaWrrvtuyXD1LKstyPsrCJs8JsdsLThRrPB+ZyU96SLlxZWfGBVpA6piQszxUu3CRcnAiXbxNaR8YLe8YL3xsuVF1kILiwjz3ClAMsbGEDoWeo0EcILFRdGxsILcQfIex+qI6b2D7oI80XbF4KVqiO32LzUsAz/Iqt83I2wISqS2GEkEIaIwQU5o9IjNAVBsQNt1hn+A3b5uds6MUpHBA4F3qBCdUJNm0SmLBPZIRgQjIjhJshjQNpCkxIZ4RR4avYhIPv2LAwGKE6sbFhYTDCwSG2axrIfqhOqZwq3JwCwAwVjWtuPxghod0QRphv0TmUAgkpLVNXWAiL73zYInNJ4woLEEJCQwQS5gc2tiwISkhniFDCvMKWBUEJrT6VIYIJ8y0b2+YHJqRyuxRQqLo0Lr+dCtgMBxS+eQIVqh6JIQIKaXx9CCqkMcSxsDIp7hmiPw/l5VS04haSGCKo0EJ/uDQFLVQ9GxsIPUOFfzsDWoj9hDC40OqjDxFaqLAfEQYXWhb2EBvgwlPjhdjP6oML0R/0nhVu6sZAGL4zEwj9d2Z04R/vzAQXbgr7F4yo8MdPvz2t/b19vw9676Z9nK2lh34vIyJcd+w71PQ/Tbuphe2bFZr4R+lEyD8R8q+xLkLuJUPoIcc/DBXqiZBjCRMWRcgxEfJPhPwTIf9EyD8R8i8BwqIm3BEhxxIkLLqZKiz6GT9DWaVsaxS1RMgyEfJPhPxLmtDE/w8YEVaNFO6IkHsi5J8I+ZcM4U6QoUItEbJMhPwTIf8SIKyKkHsJEla9zBTqGS9Mi5BjIuSfCPknQv6JkH/mC5+KkH0i5J8I+ZcAYdp8YbqaDnpiptD8GSZFaPIq1RIhy0TIPxHyT4T8EyH/RMg/EfJPhPwTIf9EyD8R8s8YYdsZji7X9Lb9tsJK0VannZ3Tl9eH2zOysS70lSLEVc23O+7i/ACbML+D0U3ji4ywVNq6ZYK+kjhxuHZn4e4vbMS8apcxCK8p74uFtRiEu1fYjDkN4xBeUF6msQhJ74gV41epE8eR5ozykSaWs8V5G1sxr/qNF2x/JbyuYyPmVxtt30l4QR3oXnlfjf5duHr9n44yvwGhxlHOFvezHAAAAABJRU5ErkJggg=="
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
    </Grid>
  );
}

export default RacingPage;
