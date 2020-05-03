import React from "react";
import "./Map.css";
import { connect } from "react-redux";

class MapPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.map = undefined;
    this.route = undefined;
  }
  componentDidMount() {
    this.map = new window.ymaps.Map("map", {
      center: [53.680058, 23.835925],
      zoom: 12,
    });
    if (this.props.route) {
      this.drawRoute();
    }
  }

  drawRoute = () => {
    const { points } = this.props.route;
    this.route = new window.ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [
          ...points.map((point) => point.coordinates.reverse()),
        ],
        params: {
          routingMode: "masstransit",
          results: 1,
        },
      },
      {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true,
        // routeActiveMarkerVisible: false,
        wayPointVisible: false,
        routeWalkMarkerVisible: false,
      }
    );
    console.log(this.route);
    this.map.geoObjects.add(this.route);
  };

  render() {
    return <div id="map" style={{ height: "100%", width: "100%" }} />;
  }
}

export default connect(
  (state) => ({
    route: state.routes.selectedRoute,
  }),
  null
)(MapPage);
