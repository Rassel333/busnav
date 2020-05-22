import {
  getFromCoordsByAddressFail,
  getFromCoordsByAddressPending,
  getFromCoordsByAddressSuccess,
  getToCoordsByAddressFail,
  getToCoordsByAddressPending,
  getToCoordsByAddressSuccess,
  updateCurrentPosition,
} from "../actions/coordinates";

let watchId;

export const watchCurrentPosition = (dispatch) => async () => {
  watchId = navigator.geolocation.watchPosition((position) => {
    const { coords } = position;
    const { latitude, longitude } = coords;
    dispatch(updateCurrentPosition([latitude, longitude]));
  });
};

export const getCurrentPosition = (dispatch) => async () => {
  dispatch(getFromCoordsByAddressPending());
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { coords } = position;
      const { latitude, longitude } = coords;
      dispatch(
        getFromCoordsByAddressSuccess(
          [latitude, longitude],
          "exact",
          "Мое местоположение"
        )
      );
    },
    (error) => {
      dispatch(getFromCoordsByAddressFail(error));
    }
  );
};

export const getCoordsByAddress = async (address) => {
  try {
    const geoCodeResult = await window.ymaps.geocode(address, { json: true });
    const [geoObject = {}] = geoCodeResult.GeoObjectCollection.featureMember;
    const point =
      geoObject.GeoObject.Point && geoObject.GeoObject.Point.pos.split(" ");
    return {
      point: [point[1], point[0]],
      precision:
        geoObject.GeoObject.metaDataProperty.GeocoderMetaData.precision,
    };
  } catch (e) {
    return e;
  }
};

export const getFromCoords = (dispatch) => async (address) => {
  dispatch(getFromCoordsByAddressPending());
  try {
    const { point, precision } = await getCoordsByAddress(address);
    dispatch(getFromCoordsByAddressSuccess(point, precision, address));
  } catch (e) {
    dispatch(getFromCoordsByAddressFail(e));
  }
};

export const getToCoords = (dispatch) => async (address) => {
  dispatch(getToCoordsByAddressPending());
  try {
    const { point, precision } = await getCoordsByAddress(address);
    dispatch(getToCoordsByAddressSuccess(point, precision, address));
  } catch (e) {
    dispatch(getToCoordsByAddressFail(e));
  }
};

export const clearPositionWatch = () => {
  navigator.geolocation.clearWatch(watchId);
};
