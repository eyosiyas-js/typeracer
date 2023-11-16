import { Grid } from "@mui/material";
import React from "react";

function RacingPage() {
  const CarImages = [
    "https://img.freepik.com/free-vector/modern-urban-adventure-suv-vehicle-illustration_1344-200.jpg?w=740&t=st=1700136437~exp=1700137037~hmac=b8ec4791c9ad1030c9d24ece4a401aae50f5ee013e7a3cd6353c7d493bb03d20",
    "https://img.freepik.com/free-psd/white-sport-car_176382-1590.jpg?w=1060&t=st=1700136624~exp=1700137224~hmac=0dc5ff0d5244f321fba5efaaa195161bf84380262d39f0086993a635bec8fe85",
    "https://img.freepik.com/premium-photo/red-city-car-with-blank-surface-your-creative-design-3d-rendering_101266-11203.jpg",
  ];

  return (
    <Grid
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {CarImages.map((car) => (
        <img style={{ width: "90px" }} src={car} />
      ))}
    </Grid>
  );
}

export default RacingPage;
