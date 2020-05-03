import {
  GET_ROUTES_PENDING,
  GET_ROUTES_SUCCESS,
  GET_ROUTES_FAIL,
  SELECT_ROUTE,
} from "../actions/routes";

export const initialState = {
  loading: false,
  data: undefined,
  error: undefined,
  selectedRoute: undefined,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ROUTES_PENDING:
      return {
        ...initialState,
        loading: true,
      };
    case GET_ROUTES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.routes,
      };
    case GET_ROUTES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case SELECT_ROUTE:
      return {
        ...state,
        selectedRoute: action.route,
      };
    default:
      return state;
  }
}
