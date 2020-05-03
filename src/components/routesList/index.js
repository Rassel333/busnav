import React from "react";
import { List, ListItem, ListSubheader, withStyles } from "@material-ui/core";
import styles from "./RouteList.module.css";
import PropTypes from "prop-types";

const StyledList = withStyles({
  root: {
    width: "100%",
    position: "relative",
    overflow: "auto",
    color: "#fff",
  },
})(List);

const headersMap = {
  transfer_routes: "Маршруты с пересадками",
  direct_routes: "Прямые маршруты",
};

const getRouteTitle = (route) => {
  const routeNames = new Set();
  route.points.forEach((point) => {
    routeNames.add(point.route_name);
  });
  return Array.from(routeNames).join(", ");
};

export const RoutesList = ({ routes, onSelect }) => {
  const routeTypes = Object.keys(routes).reverse();
  return (
    <StyledList subheader={<li />} style={{ padding: 0 }}>
      {routeTypes.map((type) => (
        <li key={`section-${type}`}>
          <ul className={styles.subList}>
            <ListSubheader style={{ color: "rgba(255, 255, 255, 0.42)" }}>
              {headersMap[type]}
            </ListSubheader>
            {routes[type].map((route, index) => (
              <ListItem
                key={`item-${type}-${index}`}
                button
                onClick={() => onSelect(route)}
              >
                {getRouteTitle(route)}
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </StyledList>
  );
};

RoutesList.propTypes = {
  routes: PropTypes.object,
  onSelect: PropTypes.func,
};
