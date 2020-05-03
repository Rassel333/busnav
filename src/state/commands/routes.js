import data from "../response";
import {
  getRoutesPending,
  getRoutesSuccess,
  setSelectedRoute,
} from "../actions/routes";

export const getRoutes = (dispatch) => (fromPoint, toPoint) => {
  dispatch(getRoutesPending());
  setTimeout(() => {
    dispatch(getRoutesSuccess(data));
  }, 700);
};

export const selectRoute = (dispatch) => (route) => {
  dispatch(setSelectedRoute(route));
};
