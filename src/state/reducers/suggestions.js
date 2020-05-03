import {
  GET_ADDRESS_SUGGESTIONS_FAIL,
  GET_ADDRESS_SUGGESTIONS_PENDING,
  GET_ADDRESS_SUGGESTIONS_SUCCESS,
} from "../actions/suggestions";

export const initialState = {
  loading: false,
  suggestions: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ADDRESS_SUGGESTIONS_PENDING:
      return {
        ...initialState,
        loading: true,
      };
    case GET_ADDRESS_SUGGESTIONS_SUCCESS:
      return {
        loading: false,
        suggestions: action.suggestions,
      };
    case GET_ADDRESS_SUGGESTIONS_FAIL:
      return {
        ...initialState,
        error: action.error,
      };
    default:
      return state;
  }
}
