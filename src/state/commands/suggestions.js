import {
  getAddressSuggestionsPending,
  getAddressSuggestionsSuccess,
  getAddressSuggestionsFail
} from "../actions/suggestions";

const city = "Гродно"

export const getSuggestions = dispatch => async request => {
  dispatch(getAddressSuggestionsPending())
  try {
    const suggestions = await window.ymaps.suggest(`${city} , ${request}`, { results: 15 })
    dispatch(getAddressSuggestionsSuccess(suggestions))
  }
  catch (e) {
    dispatch(getAddressSuggestionsFail(e))
  }
}