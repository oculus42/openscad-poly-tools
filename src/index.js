import { filterForMatch, removeDeadPoints } from './edit.mjs';
import { reportDuplicatePercentage, simplify } from './simplify.mjs';
import { center, moveToOrigin, translate } from './translate.mjs';
import importer from './import.mjs';

const { load } = importer;

export {
  center,
  filterForMatch,
  load,
  moveToOrigin,
  removeDeadPoints,
  reportDuplicatePercentage,
  simplify,
  translate,
};
