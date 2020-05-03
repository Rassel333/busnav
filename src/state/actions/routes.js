export const GET_ROUTES_PENDING = "GET_ROUTES_PENDING";
export const GET_ROUTES_SUCCESS = "GET_ROUTES_SUCCESS";
export const GET_ROUTES_FAIL = "GET_ROUTES_FAIL";

export const SELECT_ROUTE = "SELECT_ROUTE";

export const getRoutesPending = () => ({
  type: GET_ROUTES_PENDING,
});

export const getRoutesSuccess = (routes) => ({
  type: GET_ROUTES_SUCCESS,
  routes,
});
export const getRoutesFail = (error) => ({
  type: GET_ROUTES_FAIL,
  error,
});

export const setSelectedRoute = (route) => ({
  type: SELECT_ROUTE,
  route,
});
