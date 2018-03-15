/*
 * Version of simplify for testing.
 */

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

const reportDuplicatePercentage = ({ points }) => getDuplicatePercentage(points);

export {
  // TODO: cleanByDuplicateMap runs about 3X slower that brute force method?
  cleanByDuplicateMap,
  reportDuplicatePercentage,
};
