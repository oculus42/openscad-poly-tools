import { format, load, save } from './convert.mjs';
import { simplify, mergeFaces } from './simplify.mjs';

const process = (input, output, merge) => load(input)
  .then(simplify)
  .then(shape => (merge ? mergeFaces(shape) : shape))
  .then(format)
  .then(data => save(output, data));

const mergePlanes = (object) => {
  // TODO: Use normal vector data and shared points to merge triangles to planes
  if (object.normal === undefined) {
    return object;
  }
  return object;
};

export {
  mergePlanes,
  process,
};
