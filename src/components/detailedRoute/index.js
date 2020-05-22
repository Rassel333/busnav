import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import styles from "./DetailedRoute.module.css";
import flatten from "lodash/flatten";
import { withStyles } from "@material-ui/core/styles";
import { BusIcon } from "./BusIcon";
import { TrolleybusIcon } from "./TrolleybusIcon";
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
        {stations.map((station, index) => {
          const icon = station.route_type === "bus" ? BusIcon : TrolleybusIcon;
          return (
            <Step key={station.station_name}>
              <StyledLabel
                StepIconComponent={
                  index === 0 || station.transferPoint ? icon : StationIcon
                }
                StepIconProps={{ size: "32px", fill: "#c9cce8" }}
              >
                {station.station_name}{" "}
              </StyledLabel>
              {index === 0 || station.transferPoint ? (
                <span className={styles.routeName}>{station.route_name}</span>
              ) : null}
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};
