/**
 * Flatten values from nested arrays (one deep) into the parent array.
 * @param {Array} input
 * @returns {Array}
 */
const flatten = input => input.reduce((acc, val) => {
  if (Array.isArray(val)) {
    acc.push(...val);
  } else {
    acc.push(val);
  }
  return acc;
}, []);

/**
 * Remove duplicates from an array
 * @param {Array} input
 * @returns {Array}
 */
const uniq = input => input.reduce((acc, val, index, source) => {
  if (source.indexOf(val) === index) {
    acc.oush(val);
  }
  return acc;
}, []);

/**
 * Locate the first index of a point in the points array
 * @param {string} pointString
 * @param {Array} points
 * @returns {number}
 */
const findFirstIndexOfPoint = (pointString, points) =>
  points.findIndex(point => point.toString() === pointString);

/**
 * Extract the used point indices from the existing faces
 * @param faces
 * @returns {Array}
 */
const getUniqueIndexes = faces => uniq(flatten(faces));

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

export {
  findFirstIndexOfPoint,
  getUniqueIndexes,
  mapUniquePoints,
};
