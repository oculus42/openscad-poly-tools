import { findAffectedPoints } from './src/piece.mjs';
import { cleanup } from './src/simplify.mjs';
import { moveToAxis, translate } from './src/translate.mjs';

export default {
  findAffectedPoints,
  moveToAxis,
  translate,
  simplify: cleanup,
};
