import { cleanup } from './src/simplify.mjs';
import { moveBottomToAxis } from './src/translate.mjs';

export default {
  moveToAxis: moveBottomToAxis,
  simplify: cleanup,
};
