import React from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import "./App.css";
import SearchPage from "./pages/Search";
import MapPage from "./pages/Map";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import LocationCityIcon from "@material-ui/icons/LocationCity";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={SearchPage} />
        <Route path="/map" exact component={MapPage} />
      </Switch>
      <div className="footerNav">
        <NavLink
          className="searchLink"
          exact
          to="/"
          activeStyle={{ backgroundColor: "#232538" }}
        >
          <LocationSearchingIcon />
          <span>SEARCH</span>
        </NavLink>
        <NavLink
          className="mapLink"
          to="/map"
          activeStyle={{ backgroundColor: "#232538" }}
        >
          <LocationCityIcon />
          <span>MAP</span>
        </NavLink>
      </div>
    </div>
  );
}

export default App;
