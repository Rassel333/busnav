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
      <div className="mainContent">
        <Switch>
          <Route path="/" exact component={SearchPage} />
          <Route path="/map" exact component={MapPage} />
        </Switch>
      </div>
      <div className="footerNav">
        <NavLink
          className="searchLink"
          exact
          to="/"
          activeStyle={{ backgroundColor: "#232538" }}
        >
          <LocationSearchingIcon />
          <span>ПОИСК</span>
        </NavLink>
        <NavLink
          className="mapLink"
          to="/map"
          activeStyle={{ backgroundColor: "#232538" }}
        >
          <LocationCityIcon />
          <span>КАРТА</span>
        </NavLink>
      </div>
    </div>
  );
}

export default App;
