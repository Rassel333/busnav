import {
  GET_FROM_COORDS_BY_ADDRESS_FAIL,
  GET_FROM_COORDS_BY_ADDRESS_PENDING,
  GET_FROM_COORDS_BY_ADDRESS_SUCCESS,
  GET_TO_COORDS_BY_ADDRESS_PENDING,
  GET_TO_COORDS_BY_ADDRESS_SUCCESS,
  GET_TO_COORDS_BY_ADDRESS_FAIL,
} from "../actions/coordinates";

export const initialState = {
  from: {
    point: undefined,
    loading: false,
  },
  to: {
    point: undefined,
    loading: false,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FROM_COORDS_BY_ADDRESS_PENDING:
      return {
        ...state,
        from: {
          ...initialState.from,
          loading: true,
        },
      };
    case GET_FROM_COORDS_BY_ADDRESS_SUCCESS:
      return {
        ...state,
        from: {
          point: action.point,
          precision: action.precision,
          loading: false,
        },
      };
    case GET_FROM_COORDS_BY_ADDRESS_FAIL:
      return {
        ...state,
        from: {
          ...initialState,
          error: action.error,
        },
      };
    case GET_TO_COORDS_BY_ADDRESS_PENDING:
      return {
        ...state,
        to: {
          ...initialState.to,
          loading: true,
        },
      };
    case GET_TO_COORDS_BY_ADDRESS_SUCCESS:
      return {
        ...state,
        to: {
          point: action.point,
          precision: action.precision,
          loading: false,
        },
      };
    case GET_TO_COORDS_BY_ADDRESS_FAIL:
      return {
        ...state,
        to: {
          ...initialState.to,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
