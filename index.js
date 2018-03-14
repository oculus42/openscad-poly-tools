import { filterForMatch, removeDeadPoints } from './src/piece.mjs';
import { reportDuplicatePercentage, simplify } from './src/simplify.mjs';
import { centerOnAxis, moveToAxis, translate } from './src/translate.mjs';

export default {
  centerOnAxis,
  filterForMatch,
  moveToAxis,
  removeDeadPoints,
  reportDuplicatePercentage,
  simplify,
  translate,
};
