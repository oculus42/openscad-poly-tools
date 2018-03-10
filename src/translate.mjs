/**
 * Shift all points on the specified axis so the lowest is at zero
 * @param {Array} points - An array of points to manipulate
 * @param {number} axisIndex - 0 = x, 1 = y, 2 = z
 */
const moveBottomToAxis = (points, axisIndex) => {
  const axisPoints = points.map(point => point[axisIndex]);
  const base = Math.min(...axisPoints);

  return points.map((point) => {
    const newPoint = [...point];
    newPoint[axisIndex] -= base;
    return newPoint;
  });
};


export default {
  moveBottomToAxis,
};
