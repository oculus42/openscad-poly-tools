import stl from 'stl';

const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

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


const formatOpenScadModule = (operations, moduleIndex = 1) => {
  return `module object${moduleIndex}() {
  ${operations}
  }`;
};

const formatOpenScadPolyhedron = (object) => {
  const jsonString = JSON.stringify({
    points: object.points,
    faces: object.faces,
  });

  const scadString = jsonString
    .replace('"points":', 'points=')
    .replace('"faces":', 'faces=')
    .replace(/[{}]/g, '');

  return `polyhedron(${scadString});`;
};

const format = (object, moduleIndex = 1) =>
  formatOpenScadModule(formatOpenScadPolyhedron(object), moduleIndex);

const save = (filename, data) => writeFileAsync(filename, data);

export {
  load,
  format,
  save,
};
