import { getUniqueIndexes, mapUniquePoints } from './util.mjs';

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

/**
 * Eliminate unused points from the object
 * @param {Array} points
 * @param {Array} faces
 * @return {{points: *[], faces: *[]}}
 */
const removeDeadPoints = ({ points, faces }) => {
  const usedPoints = getUniqueIndexes(faces);
  const cleanPoints = points.filter((point, index) => usedPoints.includes(index));
  const pointsMap = mapUniquePoints(points, cleanPoints);
  const newFaces = faces.map(face => cleanFaceWithMap(pointsMap, face));
  return {
    points: cleanPoints,
    faces: newFaces,
  };
};

/**
 * Remove any points that do not match the predicate
 * @param predicate
 * @param points
 * @param faces
 * @return {{points: Array, faces: Array}}
 */
const filterForMatch = (predicate, { points, faces }) => {
  const affectedPoints = findAffectedPoints(predicate, points);
  const map = mapUniquePoints(points, affectedPoints);
  const newFaces = faces.map(face => cleanFaceWithMap(map, face));
  const cleanFaces = cleanBadFaces(newFaces);

  return removeDeadPoints({
    points: affectedPoints,
    faces: cleanFaces,
  });
};

export default {
  findAffectedPoints,
  filterForMatch,
  removeDeadPoints,
};
