import { findAffectedPoints } from './src/piece.mjs';
import { cleanup } from './src/simplify.mjs';
import { centerOnAxis, moveToAxis, translate } from './src/translate.mjs';

export default {
  centerOnAxis,
  findAffectedPoints,
  moveToAxis,
  translate,
  simplify: cleanup,
};
