/**
 * Adjust the values of [x, y, z] points on one axis by an amount
 * @param {number} axisIndex
 * @param {number} amount
 * @param {Array} points
 * @returns {Array} Modified Points
 */
const shiftOnAxis = (axisIndex, amount, points) =>
  points.map((point) => {
    const newPoint = [...point];
    newPoint[axisIndex] += amount;
    return newPoint;
  });

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
 * Shift all points on the specified axis so the lowest is at zero
 * @param {Array} points - An array of points to manipulate
 * @param {number} [axisIndex] - 0 = x, 1 = y, 2 = z
 * @param {boolean} [moveTop] - whether to shift the top or bottom
 * @returns {Array} Updated Points
 */
const moveToAxis = (axisIndex, moveTop, points) => moveEdgeToAxis(points, axisIndex, moveTop);

/**
 * Translate an object on all axes
 * @param {Array} points
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Array}
 */
const translate = (points, { x = 0, y = 0, z = 0 } = {}) => {
  const xShift = shiftOnAxis.bind(undefined, 0, x);
  const yShift = shiftOnAxis.bind(undefined, 1, y);
  const zShift = shiftOnAxis.bind(undefined, 2, z);
  return xShift(yShift(zShift(points)));
};

export default {
  moveEdgeToAxis,
  moveToAxis,
  shiftOnAxis,
  translate,
};

