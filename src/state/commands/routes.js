import data from "../response";
import {
  getRoutesPending,
  getRoutesSuccess,
  setSelectedRoute,
  clearRoutes,
} from "../actions/routes";

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
      route_name:
        point.route_type === "bus"
          ? `Автобус №${point.route_name}`
          : `Троллейбус №${point.route_name}`,
    });
    routeData[index].route_type = point.route_type;
  });
  dispatch(setSelectedRoute(routeData));
};

export const resetRoutes = (dispatch) => () => {
  dispatch(clearRoutes());
};
