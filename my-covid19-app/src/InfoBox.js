import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
function infoBox({
  title,
  cases,
  isRed,
  isOrange,
  isGreen,
  isBlack,
  total,
  ...props
}) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${isRed && "infoBox-red"} ${
        isOrange && "infoBox-orange"
      } ${isGreen && "infoBox-green"} ${isBlack && "infoBox-black"}`}
    >
      <CardContent>
        <h2 className="infoBox_title">{title}</h2>
        <Typography className="infoBox_total" color="textSecondary">
          {total}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default infoBox;
