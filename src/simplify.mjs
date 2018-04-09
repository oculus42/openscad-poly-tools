import intersect from 'lodash.intersection';
import { findFirstIndexOfPoint } from './utils.mjs';

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
const cleanByBruteForce = ({ points, faces, normals }) => {
  const latest = faces.reduce((acc, face) => {
    const cleanedFace = cleanFace(face, points, acc.points);

    acc.faces = [...acc.faces, cleanedFace.face];
    acc.points = cleanedFace.points;

    return acc;
  }, {
    points: [],
    faces: [],
    normals,
  });

  return latest;
};

/**
 *
 * @param {Array} points
 * @param {Array} faces
 * @returns {{points: *[], faces: *[]}}
 */
const simplify = shape => cleanByBruteForce(shape);

const reportDuplicatePercentage = ({ points }) => getDuplicatePercentage(points);

const getInsertPosition = (face, firstIndex, secondIndex) => {
  const lowIndex = Math.min(firstIndex, secondIndex);
  const highIndex = Math.max(firstIndex, secondIndex);
  const contiguous = lowIndex + 1 === highIndex;
  const edges = lowIndex === 0 && highIndex === face.length - 1;

  const edgeInsert = edges ? face.length : null;

  // console.log('c', {
  //   contiguous,
  //   edges,
  // }, contiguous ? highIndex : edges ? face.length : null,
  //   firstIndex, secondIndex);

  return contiguous ? highIndex : edgeInsert;
};

const getSparePoint = (face, points) => face.find(point => !points.includes(point));

const meshFaces = (currentFace, addFace, matches = intersect(currentFace, addFace)) => {
  const firstIndex = currentFace.indexOf(matches[0]);
  const secondIndex = currentFace.indexOf(matches[1]);
  const pointToInsert = getSparePoint(addFace, matches);
  const insertAt = getInsertPosition(currentFace, firstIndex, secondIndex);

  // Add the missing point to this face.
  currentFace.splice(insertAt, 0, pointToInsert);

  return currentFace;
};


const getFaceSets = ({ faces, normals }) => normals.reduce((acc, normal, index) => {
  const normalString = normal.join(',');
  const entry = acc[normalString] || {
    normal,
    faces: [],
  };

  entry.faces.push(faces[index]);
  acc[normalString] = entry;

  return acc;
}, {});


const extractSingleFaceNormals = faceSets => Object.values(faceSets).reduce((acc, normalSet) => {
  if (normalSet.faces.length > 1) {
    acc.multiFaceSets.push(normalSet);
  } else {
    acc.faces.push(...normalSet.faces);
    acc.normals.push(normalSet.normal);
  }
  return acc;
}, {
  faces: [],
  normals: [],
  multiFaceSets: [],
});

const mergeFaces = (shape) => {
  // Collect shared normals.

  // console.log('Start:', shape.faces.length);

  // Accumulate any single entry faces.
  const { faces, normals, multiFaceSets } = extractSingleFaceNormals(getFaceSets(shape));

  // console.log('Sets:', multiFaceSets.length);

  let cycles = 0;

  // Cycle over the sets of multiple faces
  multiFaceSets.forEach((faceSet) => {
    let currentFace;
    let otherFaces = faceSet.faces;
    let i;

    do {
      // For each face in the set.
      [currentFace, ...otherFaces] = otherFaces;
      // console.log('Starting do loop:');
      // console.log(currentFace, otherFaces);

      for (i = 0; i < otherFaces.length; i += 1) {
        cycles += 1;
        const otherFace = otherFaces[i];
        const matches = intersect(currentFace, otherFace);
        // console.log('Testing face:', otherFace, '@', i, '>', matches);

        if (matches.length === 2) {
          // Merge the faces
          meshFaces(currentFace, otherFace);
          // Remove the other face
          otherFaces.splice(i, 1);
          // Reset the index to -1 (so it's 0 after the += 1) and start again.
          i = -1;

          // console.log('Merged', otherFace, '>', currentFace);
        } else if (matches.length > 2) {
          // console.log('RangeError', i, cycles, ':', matches.length, otherFace);
        }
      }

      // Save off this face & normal
      faces.push(currentFace);
      normals.push(faceSet.normal);

      // console.log('Cycle State:', otherFaces.length, ',', i);
    } while (otherFaces.length > 0 && i <= otherFaces.length);

    // console.log('Leftover', otherFaces.length);

    if (otherFaces.length) {
      // Any remaining faces should be pushed
      faces.push(...otherFaces);
      normals.push(...otherFaces.map(() => faceSet.normal));
    }
  });

  return {
    faces,
    normals,
    points: shape.points,
  };
};

export {
  getFaceSets,
  mergeFaces,
  reportDuplicatePercentage,
  simplify,
};
