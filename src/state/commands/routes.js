import data from "../response";
import {
  getRoutesPending,
  getRoutesSuccess,
  setSelectedRoute,
  clearRoutes,
} from "../actions/routes";
import reverse from "lodash/reverse";

export const getRoutes = (dispatch) => (fromPoint, toPoint) => {
  dispatch(getRoutesPending());
  setTimeout(() => {
    dispatch(getRoutesSuccess(data));
  }, 700);
};

export const selectRoute = (dispatch) => (route) => {
  const routeData = [];
  let routeName;
  let index = 0;
  route.points.forEach((point) => {
    let transferPoint = false;
    if (!routeName) {
      routeData.push({ stations: [] });
      routeName = point.route_name;
      // transferPoint = true;
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
    });
    routeData[index].route_type = point.route_type;
  });
  console.log(routeData)
  dispatch(setSelectedRoute(routeData));
};

export const resetRoutes = (dispatch) => () => {
  dispatch(clearRoutes());
};
