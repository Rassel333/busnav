import {
  getFromCoordsByAddressFail,
  getFromCoordsByAddressPending,
  getFromCoordsByAddressSuccess,
  getToCoordsByAddressFail,
  getToCoordsByAddressPending,
  getToCoordsByAddressSuccess,
} from "../actions/coordinates";

export const watchCurrentPosition = (dispatch) => async () => {
  dispatch(getFromCoordsByAddressPending());
  try {
    navigator.geolocation.watchPosition((position) => {
      const { coords } = position;
      const { latitude, longitude } = coords;
      dispatch(getFromCoordsByAddressSuccess([latitude, longitude]));
    });
  } catch (e) {
    dispatch(getFromCoordsByAddressFail(e));
  }
};

export const getCurrentPosition = (dispatch) => async () => {
  dispatch(getFromCoordsByAddressPending());
  try {
    const { geoObjects } = await window.ymaps.geolocation.get({
      provider: "browser",
    });
    const { position = [] } = geoObjects;
    dispatch(getFromCoordsByAddressSuccess(position));
  } catch (e) {
    dispatch(getFromCoordsByAddressFail(e));
  }
};

export const getCoordsByAddress = async (address) => {
  try {
    const geoCodeResult = await window.ymaps.geocode(address, { json: true });
    const [geoObject = {}] = geoCodeResult.GeoObjectCollection.featureMember;
    return {
      point:
        geoObject.GeoObject.Point && geoObject.GeoObject.Point.pos.split(" "),
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
    dispatch(getFromCoordsByAddressSuccess(point, precision));
  } catch (e) {
    dispatch(getFromCoordsByAddressFail(e));
  }
};

export const getToCoords = (dispatch) => async (address) => {
  dispatch(getToCoordsByAddressPending());
  try {
    const { point, precision } = await getCoordsByAddress(address);
    dispatch(getToCoordsByAddressSuccess(point, precision));
  } catch (e) {
    dispatch(getToCoordsByAddressFail(e));
  }
};
