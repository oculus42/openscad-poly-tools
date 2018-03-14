import { filterForMatch, removeDeadPoints } from './src/edit.mjs';
import { reportDuplicatePercentage, simplify } from './src/simplify.mjs';
import { centerOnAxis, moveToOrigin, translate } from './src/translate.mjs';

export default {
  centerOnAxis,
  filterForMatch,
  moveToOrigin,
  removeDeadPoints,
  reportDuplicatePercentage,
  simplify,
  translate,
};
