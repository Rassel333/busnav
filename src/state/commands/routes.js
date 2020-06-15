// import data from "../response";
import {
  getRoutesPending,
  getRoutesSuccess,
  setSelectedRoute,
  clearRoutes,
} from "../actions/routes";
import axios from "axios";

export const getRoutes = (dispatch) => (fromPoint, toPoint) => {
  const [fromLat, fromLong] = fromPoint;
  const [toLat, toLong] = toPoint;
  dispatch(getRoutesPending());
  const currentDate = Date.now();
  axios
    .get(
      `https://ec2-18-157-161-39.eu-central-1.compute.amazonaws.com/transport?lat_from=${fromLat}&long_from=${fromLong}0&lat_to=${toLat}&long_to=${toLong}&time=${currentDate}&zone=3`
    )
    .then((res) => {
      dispatch(getRoutesSuccess(res.data));
    });
};

const adaptRoutesData = (route) => {
  const routeData = [];
  let routeName;
  let index = 0;
  route.points.forEach((point) => {
    let transferPoint = false;
    if (!routeName) {
      routeData.push({ stations: [] });
      routeName = point.route_name;
    }
    if (routeName !== point.route_name) {
      routeName = point.route_name;
      routeData.push({ stations: [] });
      index += 1;
      transferPoint = true;
    }
    routeData[index].stations.push({
      ...point,
      coordinates: [point.coordinates[1], point.coordinates[0]],
      transferPoint,
      startPoint: index === 0 && routeData[index].stations.length === 0,
      station_name: point.name,
      route_name:
        point.route_type === "bus"
          ? `Автобус №${point.route_name}`
          : `Троллейбус №${point.route_name}`,
    });
    routeData[index].route_type = point.route_type;
  });
  return routeData;
};

export const selectRoute = (dispatch) => (route) => {
  const routeData = adaptRoutesData(route);
  dispatch(setSelectedRoute(routeData));
};

export const resetRoutes = (dispatch) => () => {
  dispatch(clearRoutes());
};
