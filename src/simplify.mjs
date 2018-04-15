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

const meshFaces = (currentFace, addFace, insertAtProvided = -1, pointProvided = -1) => {
  let insertAt;
  let pointToInsert = pointProvided;

  const matches = intersect(currentFace, addFace);

  if (insertAtProvided !== -1) {
    insertAt = insertAtProvided;
  } else {
    const firstIndex = currentFace.indexOf(matches[0]);
    const secondIndex = currentFace.indexOf(matches[1]);
    insertAt = getInsertPosition(currentFace, firstIndex, secondIndex);
  }

  if (pointToInsert === -1) {
    pointToInsert = getSparePoint(addFace, matches);
  }

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

const findContiguousIndices = (baseArray, values) => {
  const indices = values.reduce((acc, val) => {
    // Do a for-each loop because we have to handle a value appearing multiple times.
    baseArray.forEach((rec, index) => {
      if (rec === val) {
        acc.push(index);
      }
    });

    return acc;
  }, []);

  const orderedIndicies = indices.sort();
  const maxIndex = baseArray.length - 1;

  const contiguous = orderedIndicies.reduce((acc, val, idx, arr) => {
    const firstIndex = val;
    const secondIndex = arr[idx === 0 ? (arr.length - 1) : idx + 1];

    // console.log('>', firstIndex, secondIndex, '-', maxIndex);

    if ((firstIndex === 0 && secondIndex === maxIndex) ||
      (secondIndex === 0 && firstIndex === maxIndex) ||
      Math.abs(firstIndex - secondIndex) === 1) {
      // console.log('Found contiguous:', firstIndex, secondIndex);
      return {
        insertPoint: firstIndex,
        matchingVals: [baseArray[firstIndex], baseArray[secondIndex]],
      };
    }
    return acc;
  }, -1);

  return contiguous;
};

const mergeFaces = (shape) => {
  // Collect shared normals.

  console.log('Starting Faces:', shape.faces.length);

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

        const maxIndex = currentFace.length - 1;

        if (matches.length === 2) {
          const firstIndex = currentFace.indexOf(matches[0]);
          const secondIndex = currentFace.indexOf(matches[1]);

          if ((firstIndex === 0 && secondIndex === maxIndex) ||
            (secondIndex === 0 && firstIndex === maxIndex) ||
              Math.abs(firstIndex - secondIndex) === 1) {
            // Merge the faces
            meshFaces(currentFace, otherFace);
            // Remove the other face
            otherFaces.splice(i, 1);
            // Reset the index to -1 (so it's 0 after the += 1) and start again.
            i = -1;

            // console.log('Merged', otherFace, '>', currentFace);
          } else {
            // console.log('not contiguous', firstIndex, secondIndex);
            // console.log(currentFace, otherFace);
          }
        } else if (matches.length > 2) {
          console.log('RangeError', i, cycles, ':', matches.length);
          console.log(currentFace, otherFace);

          const contiguousIndex = findContiguousIndices(currentFace, matches);
          if (contiguousIndex !== -1) {
            const valueToInsert = getSparePoint(otherFace, contiguousIndex.matchingVals);

            meshFaces(currentFace, otherFace, contiguousIndex.insertPoint, valueToInsert);
          }
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

  console.log('Ending Faces:', faces.length);

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
