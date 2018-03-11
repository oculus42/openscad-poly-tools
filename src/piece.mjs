import { mapUniquePoints } from './simplify.mjs';

// /**
//  * Creates an array of indices for points affected by the predicate
//  * @param {function} predicate
//  * @param {Array} points
//  * @returns {Array}
//  */
// const findAffectedPoints = (predicate, points) => points.reduce((acc, point, index) => {
//   if (predicate(point)) {
//     acc.push(index);
//   }
//   return acc;
// }, []);

/**
 * Filters an array of points affected by the predicate
 * @param {function} predicate
 * @param {Array} points
 * @returns {Array}
 */
const findAffectedPoints = (predicate, points) => points.filter(point => predicate(point));

/**
 * Correct the indices of the face using the index map
 * @param {object} map
 * @param {Array} face
 * @returns {Array}
 */
const cleanFaceWithMap = (map, face) => face.map(index => map[index]);

/**
 * Eliminate any faces that have a -1 (culled point) in the array
 * @param {Array} faces
 * @returns {Array}
 */
const cleanBadFaces = faces => faces.filter(face => face.indexOf(-1) === -1);

const filterForMatch = (predicate, { points, faces }) => {
  const affectedPoints = findAffectedPoints(predicate, points);
  const map = mapUniquePoints(points, affectedPoints);
  const newFaces = faces.map(face => cleanFaceWithMap(map, face));
  const cleanFaces = cleanBadFaces(newFaces);

  return {
    points: affectedPoints,
    faces: cleanFaces,
  };
};

const removeDeadPoints = ({points, faces})

export default {
  findAffectedPoints,
  filterForMatch,
};
