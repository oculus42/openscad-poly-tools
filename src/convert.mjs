import stl from 'stl';

const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

const bruteForceConvertObject = stlJson => stlJson.facets.reduce((acc, row) => ({
  points: [...acc.points, ...row.verts],
  faces: [...acc.faces, [acc.points.length, acc.points.length + 1, acc.points.length + 2]],
  normals: [...acc.normals, row.normal],
}), {
  points: [],
  faces: [],
  normals: [],
});

const load = (filename) => {
  const filePromise = readFileAsync(filename);
  return filePromise
    .then(stl.toObject.bind(stl))
    .then(bruteForceConvertObject);
};

export {
  load,
};
