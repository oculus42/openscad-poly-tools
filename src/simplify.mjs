import { findFirstIndexOfPoint, mapUniquePoints } from './util.mjs';

/**
 *
 * @param {Array} points
 * @return {Array}
 */
const getDuplicatePoints = points => points.reduce((acc, val, idx, arr) => {
  const firstIdx = findFirstIndexOfPoint(val.toString(), arr);

  if (idx !== firstIdx) {
    acc[idx] = firstIdx;
  }

  return acc;
}, {});

/**
 * Filter to only unique points
 * @param {Array} points
 * @returns {Array}
 */
const getUniquePoints = points => points.filter((val, idx, arr) =>
  idx === findFirstIndexOfPoint(val.toString(), arr));

/**
 * Provide the percentage, as a decimal, of duplicate points in the object
 * @param {Array} points
 * @param {Array} [dupPoints]
 * @returns {number}
 */
const getDuplicatePercentage = (points, dupPoints = getDuplicatePoints(points)) =>
  Object.keys(dupPoints).length / points.length;

/**
 * Accept a face, set of original points, and a set of new (reindexed) points
 * Re-index the face array against newPoints, adding to to it (immutably) as needed
 * Return a version of the face with updated indices and the points used.
 *
 * @param {Array} face - the array of indices in origPoints
 * @param {Array} origPoints - set of original points
 * @param {Array} newPoints - the set of new points
 * @returns {{points: *[], face: number[]}}
 */
const cleanFace = (face, origPoints, newPoints) => face.reduce((acc, pointIdx) => {
  const origPoint = origPoints[pointIdx];
  let matchPoint = findFirstIndexOfPoint(origPoint.toString(), acc.points);

  // Update our final point object if this one is missing
  if (matchPoint === -1) {
    acc.points = [...acc.points, origPoint];
    matchPoint = acc.points.length - 1;
  }

  acc.face = [...acc.face, matchPoint];

  return acc;
}, {
  points: newPoints,
  face: [],
});

/**
 * There may be a better way to clean the faces, but this is the first attempt
 * Walk through every face, checking every point each time.
 * We can use this to compare any new methods
 * @param {Array} points
 * @param {Array} faces
 * @returns {{points: *[], faces: *[]}}
 */
const cleanByBruteForce = (points, faces) => {
  const latest = faces.reduce((acc, face) => {
    const cleanedFace = cleanFace(face, points, acc.points);

    acc.faces = [...acc.faces, cleanedFace.face];
    acc.points = cleanedFace.points;

    return acc;
  }, {
    points: [],
    faces: [],
  });

  return latest;
};

/**
 * Correct the indices of the face using the index map
 * @param {object} map
 * @param {Array} face
 * @returns {Array}
 */
const cleanFaceWithMap = (map, face) => face.map(index => map[index]);

/**
 * Clean by using a duplicates map rather than brute force
 * @param {Array} points
 * @param {Array} faces
 * @returns {{points: *[], faces: *[]}}
 */
const cleanByDuplicateMap = (points, faces) => {
  const newPoints = getUniquePoints(points);
  const dupMap = mapUniquePoints(points, newPoints);
  const newFaces = faces.map(face => cleanFaceWithMap(dupMap, face));

  return {
    points: newPoints,
    faces: newFaces,
  };
};

/**
 *
 * @param {Array} points
 * @param {Array} faces
 * @returns {{points: *[], faces: *[]}}
 */
const cleanup = ({ points, faces }) => cleanByBruteForce(points, faces);

export {
  cleanByBruteForce,
  // TODO: cleanByDuplicateMap runs about 3X slower that brute force method?
  cleanByDuplicateMap,
  cleanup,
  cleanFace,
  findFirstIndexOfPoint,
  getDuplicatePercentage,
  getDuplicatePoints,
  mapUniquePoints,
};
