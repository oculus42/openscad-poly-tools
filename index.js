import { cleanup } from './src/simplify.mjs';
import { moveToAxis, translate } from './src/translate.mjs';

export default {
  moveToAxis,
  translate,
  simplify: cleanup,
};
