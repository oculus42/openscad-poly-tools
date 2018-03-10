import { cleanup } from './src/simplify.mjs';
import { moveEdgeToAxis, shiftOnAxis, translate } from './src/translate.mjs';

export default {
  translate,
  moveOnAxis: shiftOnAxis,
  moveToAxis: moveEdgeToAxis,
  simplify: cleanup,
};
