/**
 * Original from http://jsfiddle.net/Riham/yzvGD/
 *
 * STL to OpenSCAD converter
 * This code will read an STL file and Generate an OpenSCAD file based on the content
 * it supports both ASCII and Binary STL files.
 *
 * ##### THIS FILE IS A WORK IN PROGRESS #####
 */

const vertices = [];
const triangles = [];
let vertexIndex = 0;
let converted = 0;
let totalObjects = 0;

function formatVertex(x, y, z) {
  return `[${x},${y},${z}]`;
}

function readVertex(binaryReader) {
  return [
    binaryReader.readFloat(),
    binaryReader.readFloat(),
    binaryReader.readFloat(),
  ];
}

/**
 * Format:
 * REAL32[3] – Normal vector
 * REAL32[3] – Vertex 1
 * REAL32[3] – Vertex 2
 * REAL32[3] – Vertex 3
 * UINT16 – Attribute byte count
 * @param {BinaryReader} binaryReader
 * @return {{ normal: Object, triangle: Array }}
 */
function getBinaryTriangle(binaryReader) {

  return {
    normal: readVertex(binaryReader),
    triangle: [
      readVertex(binaryReader),
      readVertex(binaryReader),
      readVertex(binaryReader),
    ],
    byteCount: binaryReader.readUInt16()
  };
}

function parseBinaryResult(stl) {
  // This makes more sense if you read http://en.wikipedia.org/wiki/STL_(file_format)#Binary_STL
  const br = new BinaryReader(stl);
  br.seek(80); // Skip header
  const totalTriangles = br.readUInt32(); // Read # triangles

  const data = Array(totalTriangles).fill(null).map(() => getBinaryTriangle(br));

  saveResult(vertices, triangles);
}

function parseAsciiResult(stl) {

  // Find all models
  const objects = stl.split('endsolid');

  for (let o = 0; o < objects.length; o++) {

    // Translation: a non-greedy regex for loop {...} endloop pattern
    const patt = /\bloop[\s\S]*?\endloop/mgi;
    const result = 'matches are: ';
    converted = 0;
    match = objects[o].match(patt);
    if (match == null) continue;

    for (const i = 0; i < match.length; i++) {
      try {
        document.getElementById('conversion').innerText = 'In Progress - Object ' + (o + 1) + ' out of ' + objects.length + ' Converted ' + (++converted) + ' out of ' + match.length + ' facets!';

        //3 different vertex objects each with 3 numbers.
        const vpatt = /\bvertex\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s*vertex\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s*vertex\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s+(-?\d+\.?\d*\E?\e?\-?\+?\d*\.?\d*)\s*/mgi;

        const v = vpatt.exec(match[i]);
        if (v == null) continue;

        if (v.length != 10) {
          document.getElementById('error').innerText = '\r\nFailed to parse ' + match[i];
          break;
        }

        const v1 = '[' + v[1] + ',' + v[2] + ',' + v[3] + ']';
        const v2 = '[' + v[4] + ',' + v[5] + ',' + v[6] + ']';
        const v3 = '[' + v[7] + ',' + v[8] + ',' + v[9] + ']';
        const triangle = '[' + (vertexIndex++) + ',' + (vertexIndex++) + ',' + (vertexIndex++) + ']';
        // Add 3 vertices for every triangle

        //TODO: OPTIMIZE: Check if the vertex is already in the array, if it is just reuse the index
        vertices.push(v1);
        vertices.push(v2);
        vertices.push(v3);
        triangles.push(triangle);
      } catch (err) {
        error(err);
        return;
      }
    }

    saveResult(vertices, triangles);
  }
}

// stl: the stl file context as a string
// parseResult: This function checks if the file is ASCII or Binary, and parses the file accordingly
function parseResult(stl) {
  const isAscii = stl.every(entry => entry.charCodeAt(0) !== 0);

  if (!isAscii) {
    return parseBinaryResult(stl);
  }

  return parseAsciiResult(stl);
}

// Input: Set of vertices and triangles, both are strings
// Makes the Download link create an OpenSCAD file with a polyhedron object that represents the parsed stl file
function saveResult(vertices, triangles) {

  const poly = `polyhedron(\r\n points=[${vertices}],\r\nfaces=[${triangles}]);`;

  totalObjects += 1;

  const calls = `object${totalObjects}(1);\r\n\r\n`;

  const modules = `module object${totalObjects}(scale) {${poly}}\r\n\r\n`;

  const result = modules + calls;

  const blob = new Blob([result], {
    type: 'text/plain',
  });

  return blob;
}

function handleFileSelect(evt) {
  // Reset progress indicator on new file selection.
  progress.style.width = '0%';
  progress.textContent = '0%';

  const reader = new FileReader();
  reader.onerror = errorHandler;
  reader.onabort = () => alert('File read cancelled');
  reader.onloadstart = function (e) {
    document.getElementById('progress_bar').className = 'loading';
  };

  reader.onload = function (e) {
    // Ensure that the progress bar displays 100% at the end.
    progress.style.width = '100%';
    progress.textContent = '100%';
    setTimeout("document.getElementById('progress_bar').className='';", 2000);
    parseResult(reader.result);
  };

  // Read in the stl file as a binary string.
  reader.readAsBinaryString(evt.target.files[0]);
}
