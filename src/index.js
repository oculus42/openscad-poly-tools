// import { filterForMatch, removeDeadPoints } from './edit.mjs';
// import { reportDuplicatePercentage, simplify } from './simplify.mjs';
// import { center, moveToOrigin, translate } from './translate.mjs';
// TODO: make it less painful to maintain both files
import {
  center,
  filterForMatch,
  moveToOrigin,
  removeDeadPoints,
  reportDuplicatePercentage,
  simplify,
  translate,
} from './index-web';

import { format, load, save } from './convert.mjs';
import { process } from './process.mjs';

export {
  center,
  filterForMatch,
  format,
  load,
  moveToOrigin,
  process,
  removeDeadPoints,
  reportDuplicatePercentage,
  save,
  simplify,
  translate,
};
