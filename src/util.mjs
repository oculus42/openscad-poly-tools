import _ from 'lodash';

/**
 * Locate the first index of a point in the points array
 * @param {string} pointString
 * @param {Array} points
 * @returns {number}
 */
const findFirstIndexOfPoint = (pointString, points) =>
  _.findIndex(points, point => point.toString() === pointString);

/**
 * Extract the used point indices from the existing faces
 * @param faces
 * @returns {Array}
 */
const getUniqueIndexes = faces => _.chain(faces).flatten(true).uniq().value();

/**
 * Map of indices from one array of points to the other
 * @param {Array} origPoints
 * @param {Array} uniquePoints - the set of points without duplicates
 * @returns {object}
 */
const mapUniquePoints = (origPoints, uniquePoints) => origPoints.reduce((acc, val, idx) => {
  const firstIdx = findFirstIndexOfPoint(val.toString(), uniquePoints);

  // Have to handle both duplicates and the early matches
  if (idx !== firstIdx || acc[idx] === undefined) {
    acc[idx] = firstIdx;
  }

  return acc;
}, {});

export default {
  findFirstIndexOfPoint,
  getUniqueIndexes,
  mapUniquePoints,
};
