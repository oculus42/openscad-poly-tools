import { cleanup } from './src/simplify.mjs';
import { moveEdgeToAxis, shiftOnAxis } from './src/translate.mjs';

export default {
  moveToAxis: moveEdgeToAxis,
  moveOnAxis: shiftOnAxis,
  simplify: cleanup,
};
