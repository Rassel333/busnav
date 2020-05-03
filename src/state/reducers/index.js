import { combineReducers } from "redux";
import coordinates, {
  initialState as CoordinatesInitialState,
} from "./coordinates";
import suggestions, {
  initialState as SuggestionsInitialState,
} from "./suggestions";
import routes, { initialState as RoutesInitialState } from "./routes";

export const rootInitialState = {
  coordinates: CoordinatesInitialState,
  suggestions: SuggestionsInitialState,
  routes: RoutesInitialState,
};

export const reducers = combineReducers({
  coordinates,
  suggestions,
  routes,
});
