
/**
 * Locate the first index of a point in the points array
 * @param {string} pointString
 * @param {Array} points
 * @returns {number}
 */
const findFirstIndexOfPoint = (pointString, points) =>
  _.findIndex(points, point => point.toString() === pointString);

export default {
  findFirstIndexOfPoint,
};
