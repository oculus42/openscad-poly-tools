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

const getDuplicatePercentage = (points, dupPoints = getDuplicatePoints(points)) =>
  Object.keys(dupPoints).length / points.length;


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
 *
 * @param {Array} points
 * @param {Array} faces
 */
const bruteForceClean = (points, faces) => {
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
 *
 * @param {Array} points
 * @param {Array} faces
 * @param {boolean} [report]
 */
const cleanup = ({ points, faces }, report = false) => {
  if (report) {
    console.log('Duplicates', getDuplicatePercentage(points));
  }

  return bruteForceClean(points, faces);
};

export {
  cleanup,
  cleanFace,
  findFirstIndexOfPoint,
  getDuplicatePercentage,
  getDuplicatePoints,
};
