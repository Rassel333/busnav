import React from "react";
import { LinearProgress, withStyles } from "@material-ui/core";
import styles from "./Progress.module.css";

const ProgressBar = withStyles({
  root: {
    width: "100%",
    height: "0.5rem",
    "& .MuiLinearProgress-bar1Indeterminate": {
      backgroundColor: "rgba(255, 255, 255, 0.42);",
    },
    "& .MuiLinearProgress-bar2Indeterminate": {
      backgroundColor: "#33354ef0",
    },
  },
})(LinearProgress);

export const Progress = () => (
  <div className={styles.progressWrapper}>
    <ProgressBar />
  </div>
);
