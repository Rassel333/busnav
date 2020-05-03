export const GET_FROM_COORDS_BY_ADDRESS_PENDING =
  "GET_FROM_COORDS_BY_ADDRESS_PENDING";
export const GET_FROM_COORDS_BY_ADDRESS_SUCCESS =
  "GET_FROM_COORDS_BY_ADDRESS_SUCCESS";
export const GET_FROM_COORDS_BY_ADDRESS_FAIL =
  "GET_FROM_COORDS_BY_ADDRESS_FAIL";

export const GET_TO_COORDS_BY_ADDRESS_PENDING =
  "GET_TO_COORDS_BY_ADDRESS_PENDING";
export const GET_TO_COORDS_BY_ADDRESS_SUCCESS =
  "GET_TO_COORDS_BY_ADDRESS_SUCCESS";
export const GET_TO_COORDS_BY_ADDRESS_FAIL = "GET_TO_COORDS_BY_ADDRESS_FAIL";
export const CURRENT_POSITION_UPDATED = "CURRENT_POSITION_UPDATED";

export const getFromCoordsByAddressPending = () => ({
  type: GET_FROM_COORDS_BY_ADDRESS_PENDING,
});

export const getFromCoordsByAddressSuccess = (point, precision = "exact") => ({
  type: GET_FROM_COORDS_BY_ADDRESS_SUCCESS,
  point,
  precision,
});

export const getFromCoordsByAddressFail = (error) => ({
  type: GET_FROM_COORDS_BY_ADDRESS_FAIL,
  error,
});

export const getToCoordsByAddressPending = () => ({
  type: GET_TO_COORDS_BY_ADDRESS_PENDING,
});

export const getToCoordsByAddressSuccess = (point, precision) => ({
  type: GET_TO_COORDS_BY_ADDRESS_SUCCESS,
  point,
  precision,
});

export const getToCoordsByAddressFail = (error) => ({
  type: GET_TO_COORDS_BY_ADDRESS_FAIL,
  error,
});

export const currentPositionUpdated = (point) => ({
  type: CURRENT_POSITION_UPDATED,
  point,
});
