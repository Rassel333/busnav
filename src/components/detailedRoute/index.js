import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import styles from "./DetailedRoute.module.css";
import flatten from "lodash/flatten";
import { withStyles } from "@material-ui/core/styles";

const Icon = ({ size, fill }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    x="0"
    y="0"
    enableBackground="new 0 0 484.5 484.5"
    version="1.1"
    viewBox="0 0 484.5 484.5"
    xmlSpace="preserve"
    fill={fill}
    style={{ marginLeft: "-3px" }}
  >
    <path d="M38.25 357c0 22.95 10.2 43.35 25.5 56.1V459c0 15.3 10.2 25.5 25.5 25.5h25.5c15.3 0 25.5-10.2 25.5-25.5v-25.5h204V459c0 15.3 10.2 25.5 25.5 25.5h25.5c15.3 0 25.5-10.2 25.5-25.5v-45.9c15.3-12.75 25.5-33.149 25.5-56.1V102c0-89.25-91.8-102-204-102s-204 12.75-204 102v255zm89.25 25.5c-20.4 0-38.25-17.85-38.25-38.25S107.1 306 127.5 306s38.25 17.85 38.25 38.25-17.85 38.25-38.25 38.25zm229.5 0c-20.4 0-38.25-17.85-38.25-38.25S336.6 306 357 306s38.25 17.85 38.25 38.25S377.4 382.5 357 382.5zm38.25-153h-306V102h306v127.5z"></path>
  </svg>
);
const StationIcon = () => <div className={styles.station} />;

const StyledLabel = withStyles({
  label: {
    color: "#c9cce8",
  },
})(StepLabel);

export const DetailedRoute = ({ route }) => {
  const flattedRoute = flatten(route);
  const stations = flattedRoute.reduce((sts, data) => {
    return [...sts, ...data.stations];
  }, []);
  return (
    <div className={styles.stepper}>
      <Stepper
        activeStep={-1}
        orientation="vertical"
        style={{ backgroundColor: "transparent" }}
      >
        {stations.map((station, index) => (
          <Step key={station.station_name}>
            <StyledLabel
              StepIconComponent={
                index === 0 || station.transferPoint ? Icon : StationIcon
              }
              StepIconProps={{ size: "32px", fill: "#c9cce8" }}
            >
              {station.station_name}{" "}
            </StyledLabel>
            {index === 0 || station.transferPoint ? (
              <span className={styles.routeName}>№ {station.route_name}</span>
            ) : null}
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
