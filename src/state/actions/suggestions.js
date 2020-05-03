export const GET_ADDRESS_SUGGESTIONS_PENDING = "GET_ADDRESS_SUGGESTIONS_PENDING";
export const GET_ADDRESS_SUGGESTIONS_SUCCESS = "GET_ADDRESS_SUGGESTIONS_SUCCESS";
export const GET_ADDRESS_SUGGESTIONS_FAIL = "GET_ADDRESS_SUGGESTIONS_FAIL";

export const getAddressSuggestionsPending = () => ({
  type: GET_ADDRESS_SUGGESTIONS_PENDING
})

export const getAddressSuggestionsSuccess = (suggestions) => ({
  type: GET_ADDRESS_SUGGESTIONS_SUCCESS,
  suggestions
})

export const getAddressSuggestionsFail = (error) => ({
  type: GET_ADDRESS_SUGGESTIONS_FAIL,
  error
})