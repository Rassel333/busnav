import React from "react";
import styles from "./Map.module.css";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import {
  clearPositionWatch,
  watchCurrentPosition,
} from "../../state/commands/coordinates";
import moment from "moment";
import { DetailedRoute } from "../../components/detailedRoute";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { Clear } from "@material-ui/icons";
import { withStyles } from "@material-ui/core";

const StyledDrawer = withStyles({
  paper: {
    backgroundColor: "#33354ef0",
  },
})(Drawer);

class MapPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.map = undefined;
    this.routes = [];
    this.stationIcons = [];
    this.currentPositionIcon = undefined;
    this.intervalId = undefined;
    this.state = {
      transferStationRouteMessage: "",
      departureTime: undefined,
      timeToDeparture: undefined,
      routeDetailsInfoOpened: false,
    };
  }
  componentDidMount() {
    this.map = new window.ymaps.Map("map", {
      center: [53.680058, 23.835925],
      zoom: 12,
    });
    this.initCircle();
    this.props.watchCurrentPosition();
    this.updateCurrentPositionPlaceMark();
    if (this.props.route) {
      this.drawRoute();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(this.props.currentPosition, prevProps.currentPosition)) {
      this.updateCurrentPositionPlaceMark();
    }
  }

  updateCurrentPositionPlaceMark = () => {
    const { currentPosition } = this.props;
    if (!this.currentPositionIcon) {
      this.currentPositionIcon = new window.ymaps.Placemark(
        currentPosition,
        {
          iconContent: "Я",
        },
        {
          preset: "islands#redIcon",
        }
      );
      this.map.geoObjects.add(this.currentPositionIcon);
    }
    this.currentPositionIcon.geometry.setCoordinates(
      this.props.currentPosition
    );
    this.checkVisitedStation();
    this.checkForTransfer();
  };

  initCircle = () => {
    this.circle = new window.ymaps.Circle(
      [[0, 0], 1],
      {},
      {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "rgba(0, 0, 0, 0)",
      }
    );
    this.map.geoObjects.add(this.circle);
  };

  checkVisitedStation = () => {
    this.circle.geometry.setCoordinates(this.props.currentPosition);
    this.circle.geometry.setRadius(10);
    this.stationIcons.forEach((icon) => {
      const content = icon.properties.get("iconContent");
      if (
        this.circle.geometry.contains(icon.geometry.getCoordinates()) &&
        !content.stationPassed
      ) {
        icon.options.set("preset", "islands#grayMassTransitCircleIcon");
        icon.properties.set("iconContent", { ...content, stationPassed: true });
      }
    });
  };

  checkForTransfer = () => {
    this.circle.geometry.setCoordinates(this.props.currentPosition);
    this.circle.geometry.setRadius(50);
    this.stationIcons.forEach((icon, index) => {
      const content = icon.properties.get("iconContent");
      if (
        this.circle.geometry.contains(icon.geometry.getCoordinates()) &&
        !content.stationPassed &&
        !content.startPoint &&
        content.transferPoint
      ) {
        this.calculateTimeLeft(content.time, content.route_name, false);
      } else if (
        this.circle.geometry.contains(icon.geometry.getCoordinates()) &&
        content.stationPassed &&
        this.state.transferStationRouteMessage
      ) {
        clearInterval(this.intervalId);
        this.setState({
          transferStationRouteMessage: "",
          timeToDeparture: undefined,
          departureTime: undefined,
        });
      }
    });
  };

  calculateTimeLeft = (departureTime, routeName, startPoint) => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      const now = moment.utc().valueOf();
      const msLeft = departureTime - now;
      this.setState({
        timeToDeparture: msLeft,
      });
    }, 1000);
    const label = startPoint ? "" : "Пересадка на маршрут ";
    this.setState({
      transferStationRouteMessage: `${label}№${routeName}`,
      departureTime,
    });
  };

  drawRoute = () => {
    const { route } = this.props;
    const routeFirstPoint = route[0].stations[0].coordinates;
    const pedestrianStartRoute = this.createStartPedestrianStartRoute(
      routeFirstPoint
    );
    this.routes.push(pedestrianStartRoute);

    route.forEach((routePart, index) => {
      let routeGeoObject;
      if (routePart.route_type === "pedestrian") {
        routeGeoObject = new window.ymaps.multiRouter.MultiRoute(
          {
            referencePoints: [routePart.from, routePart.to],
            params: {
              routingMode: routePart.route_type,
              results: 1,
              searchCoordOrder: "latlong",
            },
          },
          {
            routeActiveMarkerVisible: false,
            wayPointVisible: false,
            routeWalkMarkerVisible: false,
          }
        );
      } else {
        const pathToNext = routePart.stations.reduce(
          (arr, point, stationIndex, stations) => {
            if (stationIndex === 0) {
              arr.push(point.coordinates);
              arr.push(
                ...point.path_to_next.map((pathPoint) => [
                  pathPoint[1],
                  pathPoint[0],
                ])
              );
            }
            if (stationIndex > 0 && stationIndex < stations.length - 1) {
              arr.push(
                ...point.path_to_next.map((pathPoint) => [
                  pathPoint[1],
                  pathPoint[0],
                ])
              );
            }
            if (
              stationIndex === stations.length - 1 &&
              index === route.length - 1
            ) {
              arr.push(point.coordinates);
            }
            return arr;
          },
          []
        );
        routeGeoObject = new window.ymaps.Polyline(
          [...pathToNext],
          {},
          {
            strokeWidth: 4,
          }
        );
      }
      this.routes.push(routeGeoObject);
      routePart.stations.forEach(this.createStationPlaceMark);
    });
    const lastRoute = route[route.length - 1].stations;
    const routeLastPoint = lastRoute[lastRoute.length - 1].coordinates;
    const pedestrianEndRoute = this.createPedestrianEndRoute(routeLastPoint);
    this.routes.push(pedestrianEndRoute);
    this.routes.forEach((route) => {
      this.map.geoObjects.add(route);
    });
    this.stationIcons.forEach((icon) => {
      this.map.geoObjects.add(icon);
    });
  };

  createStationPlaceMark = (station, index, stations) => {
    if (station.startPoint) {
      this.calculateTimeLeft(
        station.departure_time,
        station.route_name,
        station.startPoint
      );
    }
    const stationIcon = new window.ymaps.Placemark(
      station.coordinates,
      {
        iconCaption: station.transferPoint
          ? `${station.station_name} (Пересадка)`
          : station.station_name,
        iconContent: {
          transferPoint: station.transferPoint,
          stationPassed: false,
          route_name: station.route_name,
          startPoint: station.startPoint,
          time: station.departure_time,
        },
      },
      {
        preset: "islands#greenMassTransitCircleIcon",
      }
    );
    this.stationIcons.push(stationIcon);
  };

  createStartPedestrianStartRoute = (routeFirstPoint) => {
    return new window.ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [
          this.props.fromPoint,
          // [53.6405, 23.8648],
          routeFirstPoint,
        ],
        params: {
          routingMode: "pedestrian",
          results: 1,
          searchCoordOrder: "latlong",
        },
      },
      {
        boundsAutoApply: true,
        routeActiveMarkerVisible: false,
        wayPointVisible: false,
        routeWalkMarkerVisible: false,
      }
    );
  };

  createPedestrianEndRoute = (routeLastPoint) => {
    return new window.ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [
          routeLastPoint,
          // this.props.toPoint
          [53.646, 23.8489],
        ],
        params: {
          routingMode: "pedestrian",
          results: 1,
          // searchCoordOrder: "longlat",
          searchCoordOrder: "latlong",
        },
      },
      {
        routeActiveMarkerVisible: false,
        wayPointVisible: false,
        routeWalkMarkerVisible: false,
      }
    );
  };

  componentWillUnmount() {
    clearPositionWatch();
  }

  toggleDetailedRouteInfo = (isOpened) => () => {
    this.setState({
      routeDetailsInfoOpened: isOpened,
    });
  };

  render() {
    const {
      departureTime,
      timeToDeparture,
      routeDetailsInfoOpened,
      transferStationRouteMessage,
    } = this.state;
    const time = moment(departureTime).format("HH:mm");
    const timeLeft = moment.duration(timeToDeparture);
    const hoursLeft = timeLeft.get("hours");
    const minutesLeft = timeLeft.get("minutes");
    return (
      <div className={styles.mapPageWrapper}>
        {this.props.route && (
          <Button
            variant="contained"
            color="primary"
            className={styles.showDetails}
            onClick={this.toggleDetailedRouteInfo(true)}
          >
            Детали поездки
          </Button>
        )}
        <div id="map" style={{ height: "100%", width: "100%" }} />
        {transferStationRouteMessage && (
          <div className={styles.transferInfo}>
            <div>
              {transferStationRouteMessage} ({time})
            </div>
            {!!timeToDeparture && (
              <div>
                До отправления {hoursLeft}ч. {minutesLeft} мин.
              </div>
            )}
          </div>
        )}
        {this.props.route && (
          <StyledDrawer
            anchor="right"
            open={routeDetailsInfoOpened}
            onClose={this.toggleDetailedRouteInfo(false)}
          >
            <div
              className={styles.closeDrawer}
              onClick={this.toggleDetailedRouteInfo(false)}
            >
              <Clear fontSize="20px" />
            </div>
            <DetailedRoute route={this.props.route} />
          </StyledDrawer>
        )}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    route: state.routes.selectedRoute,
    fromPoint: state.coordinates.from.point,
    toPoint: state.coordinates.to.point,
    currentPosition: state.coordinates.currentPosition,
  }),
  (dispatch) => ({
    watchCurrentPosition: watchCurrentPosition(dispatch),
  })
)(MapPage);
