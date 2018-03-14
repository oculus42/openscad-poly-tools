/**
 * Adjust the values of [x, y, z] points on one axis by an amount
 * @param {number} axisIndex
 * @param {number} amount
 * @param {Array} points
 * @returns {Array} Modified Points
 */
const shiftOnAxis = (axisIndex, amount, points) => {
  if (amount == null || amount === 0) {
    return points;
  }
  return points.map((point) => {
    const newPoint = [...point];
    newPoint[axisIndex] += amount;
    return newPoint;
  });
};

/**
 * Shift all points on the specified axis so the lowest is at zero
 * @param {Array} points - An array of points to manipulate
 * @param {number} [axisIndex] - 0 = x, 1 = y, 2 = z
 * @param {boolean} [moveTop] - whether to shift the top or bottom
 * @returns {Array} Updated Points
 */
const moveEdgeToAxis = (points, axisIndex = 0, moveTop = false) => {
  const axisPoints = points.map(point => point[axisIndex]);
  const base = Math[moveTop ? 'max' : 'min'](...axisPoints);

  return shiftOnAxis(axisIndex, -base, points);
};

/**
 * Center the object using the min and max points
 * @param {number} axisIndex
 * @param {Array} points
 * @return {Array}
 */
const centerOnAxis = (axisIndex, points) => {
  const axisPoints = points.map(point => point[axisIndex]);
  const lower = Math.min(...axisPoints);
  const upper = Math.max(...axisPoints);
  const center = (lower + upper) / 2;

  return shiftOnAxis(axisIndex, -center, points);
};

/**
 * Translate an object on all axes
 * @param {Array} points
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Array}
 */
const translatePoints = (points, { x = 0, y = 0, z = 0 } = {}) => {
  const xShift = shiftOnAxis.bind(undefined, 0, x);
  const yShift = shiftOnAxis.bind(undefined, 1, y);
  const zShift = shiftOnAxis.bind(undefined, 2, z);
  return xShift(yShift(zShift(points)));
};

/**
 * Convert axis string or index to index
 * @param {string|number} axis
 * @return {number}
 */
const getAxis = axis => ({
  0: 0,
  1: 1,
  2: 2,
  x: 0,
  y: 1,
  z: 2,
}[axis]);


/*
 * Consistent parameters
 */


/**
 * Align
 * @param {Array} points - Array of points to manipulate
 * @param {Array} faces - Array of faces. Passed to the return object
 * @param {number|string} axis - axis 'x', 'y', 'z' or index 0, 1, 2.
 * @return {{faces: *, points: Array}}
 */
const center = ({ points, faces }, axis) => {
  const useAxis = getAxis(axis);
  return {
    faces,
    points: centerOnAxis(useAxis, points),
  };
};

/**
 * Move the "bottom" or "top" of the model to the origin
 * @param {Array} points - Array of points to manipulate
 * @param {Array} faces - Array of faces. Passed to the return object
 * @param {number|string} [axis] - axis 'x', 'y', 'z' or index 0, 1, 2.
 * @param {boolean} [moveTop] - Use the bottom (Math.min) or top (Math.max) point for alignment.
 * @return {{faces: *, points: Array}}
 */
const moveToOrigin = ({ points, faces }, axis, moveTop) => ({
  faces,
  points: moveEdgeToAxis(points, getAxis(axis), moveTop),
});

/**
 *
 * @param {Array} points - Array of points to manipulate
 * @param {Array} faces - Array of faces. Passed to the return object
 * @param {{x:number, y:number, z:number}} vector - Indicates the amount to move on each axis.
 * @return {{faces: *, points: Array}}
 */
const translate = ({ faces, points }, vector) => ({
  faces,
  points: translatePoints(points, vector),
});

export default {
  center,
  moveToOrigin,
  translate,
};

