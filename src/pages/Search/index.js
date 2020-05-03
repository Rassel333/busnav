import React from "react";
import { connect } from "react-redux";
import { Tooltip } from "@material-ui/core";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import isEqual from "lodash/isEqual";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styles from "./SearchPage.module.css";
import { SearchInput } from "../../components/searchInput";
import { Suggestions } from "../../components/suggestions";
import { RoutesList } from "../../components/routesList";
import {
  getFromCoords,
  getToCoords,
  getCurrentPosition,
} from "../../state/commands/coordinates";
import { getSuggestions } from "../../state/commands/suggestions";
import { Progress } from "../../components/progress";
import { getRoutes, selectRoute } from "../../state/commands/routes";

export class SearchPage extends React.PureComponent {
  state = {
    fromValue: "",
    fromValueChanging: false,
    selectedFromValue: undefined,
    toValue: "",
    toValueChanging: false,
    selectedToValue: undefined,
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      fromValue,
      toValue,
      selectedFromValue,
      selectedToValue,
      fromValueChanging,
      toValueChanging,
    } = this.state;
    const {
      fromPoint,
      toPoint,
      fromPointPrecision,
      toPointPrecision,
    } = this.props;
    if (fromValue && fromValue !== prevState.fromValue) {
      this.props.getSuggestions(fromValue);
    }
    if (toValue && toValue !== prevState.toValue) {
      this.props.getSuggestions(toValue);
    }
    if (
      selectedFromValue &&
      selectedFromValue !== prevState.selectedFromValue
    ) {
      this.props.getFromCoords(selectedFromValue);
    }
    if (selectedToValue && selectedToValue !== prevState.selectedToValue) {
      this.props.getToCoords(selectedToValue);
    }
    if (
      fromValueChanging &&
      fromPointPrecision === "exact" &&
      fromPointPrecision !== prevProps.fromPointPrecision
    ) {
      this.setState({
        fromValueChanging: false,
      });
    }
    if (
      toValueChanging &&
      toPointPrecision === "exact" &&
      toPointPrecision !== prevProps.toPointPrecision
    ) {
      this.setState({
        toValueChanging: false,
      });
    }
    if (
      fromPoint &&
      toPoint &&
      toPointPrecision === "exact" &&
      fromPointPrecision === "exact" &&
      (!isEqual(fromPoint, prevProps.fromPoint) ||
        !isEqual(toPoint, prevProps.toPoint))
    ) {
      this.props.getRoutes();
    }
  }

  selectAddress = (value, label) => {
    if (this.state.fromValueChanging) {
      this.setState({
        selectedFromValue: value,
        fromValue: label,
      });
    }
    if (this.state.toValueChanging) {
      this.setState({
        selectedToValue: value,
        toValue: label,
        toValueChanging:
          this.props.toPointPrecision === "exact"
            ? false
            : this.state.toValueChanging,
      });
    }
  };

  searchFromChange = (value) => {
    if (value === "") {
      this.setState({
        fromValue: value,
        selectedFromValue: undefined,
      });
      return;
    }
    this.setState({
      fromValue: value,
      fromValueChanging: true,
      toValueChanging: false,
      selectedFromValue: undefined,
    });
  };

  searchToChange = (value) => {
    if (value === "") {
      this.setState({
        toValue: value,
        selectedToValue: undefined,
      });
      return;
    }
    this.setState({
      toValue: value,
      fromValueChanging: false,
      toValueChanging: true,
      selectedToValue: undefined,
    });
  };

  renderSuggestionsContent = () => {
    const {
      state: { fromValue, toValue },
      props: { suggestions },
    } = this;
    return (
      <div className={styles.suggestionsWrapper}>
        <Suggestions
          onSelect={this.selectAddress}
          suggestions={suggestions}
          fromValue={fromValue}
          toValue={toValue}
        />
      </div>
    );
  };

  selectRoute = (route) => {
    this.props.selectRoute(route);
    this.props.history.push("/map");
  };

  renderPageContent = () => {
    const {
      props: { fromPoint, toPoint, routes },
    } = this;
    return fromPoint && toPoint && routes ? (
      <RoutesList routes={routes} onSelect={this.selectRoute} />
    ) : (
      <div className={styles.infoMessage}>Выберите точки маршрута</div>
    );
  };

  defineCurrentPosition = () => {
    this.setState({
      fromValue: "Моё местоположение",
    });
    this.props.getCurrentPosition();
  };

  render() {
    const {
      state: {
        fromValue,
        toValue,
        selectedFromValue,
        selectedToValue,
        toValueChanging,
        fromValueChanging,
      },
      props: { fromPointPrecision, toPointPrecision, loading },
    } = this;

    return (
      <div className={styles.searchPage}>
        <div className={styles.searchWrapper}>
          <div className={styles.fieldRow}>
            <SearchInput
              value={fromValue}
              onChange={(value) => this.searchFromChange(value)}
              label="Выберите начальную точку"
              icon={
                <Tooltip placement="bottom-end" title="Текущее местоположение">
                  <PersonPinCircleIcon
                    style={{ color: "#fff", cursor: "pointer" }}
                    onClick={this.defineCurrentPosition}
                  />
                </Tooltip>
              }
            />
          </div>
          <div className={styles.fieldRow}>
            <SearchInput
              value={toValue}
              onChange={(value) => this.searchToChange(value)}
              label="Выберите конечную точку"
            />
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            {!loading ? (
              <>
                {fromValueChanging ||
                (selectedFromValue && fromPointPrecision === "street") ||
                toValueChanging ||
                (selectedToValue && toPointPrecision === "street")
                  ? this.renderSuggestionsContent()
                  : this.renderPageContent()}
              </>
            ) : (
              <Progress />
            )}
          </div>
        </div>
      </div>
    );
  }
}

SearchPage.propTypes = {
  suggestions: PropTypes.array,
  fromPointPrecision: PropTypes.oneOf(["exact", "street"]),
  toPointPrecision: PropTypes.oneOf(["exact", "street"]),
  loading: PropTypes.bool,
  getFromCoords: PropTypes.func,
  getToCoords: PropTypes.func,
  getSuggestions: PropTypes.func,
  getRoutes: PropTypes.func,
  fromPoint: PropTypes.array,
  toPoint: PropTypes.array,
};

export default connect(
  (state) => ({
    suggestions: state.suggestions.suggestions,
    fromPointPrecision: state.coordinates.from.precision,
    fromPoint: state.coordinates.from.point,
    toPoint: state.coordinates.to.point,
    toPointPrecision: state.coordinates.to.precision,
    loading:
      state.suggestions.loading ||
      state.coordinates.from.loading ||
      state.coordinates.to.loading ||
      state.routes.loading,
    routes: state.routes.data,
  }),
  (dispatch) => ({
    getFromCoords: getFromCoords(dispatch),
    getToCoords: getToCoords(dispatch),
    getSuggestions: getSuggestions(dispatch),
    getCurrentPosition: getCurrentPosition(dispatch),
    getRoutes: getRoutes(dispatch),
    selectRoute: selectRoute(dispatch),
  })
)(withRouter(SearchPage));
