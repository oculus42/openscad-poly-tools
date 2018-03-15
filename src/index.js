import { filterForMatch, removeDeadPoints } from './edit.mjs';
import { reportDuplicatePercentage, simplify } from './simplify.mjs';
import { centerOnAxis, moveToOrigin, translate } from './translate.mjs';

export default {
  centerOnAxis,
  filterForMatch,
  moveToOrigin,
  removeDeadPoints,
  reportDuplicatePercentage,
  simplify,
  translate,
};
