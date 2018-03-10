# openscad-poly-simplify
A library to reduce point duplication in OpenSCAD Polyhedrons

## Motivaiton
After importing an STL into OpenSCAD with http://jsfiddle.net/Riham/yzvGD/ I realized there was a significant duplication of points.

## Goals
1. To perform simple, brute-force point de-duplication on polyhedrons.
2. To identify faces sharing points in the same plane and merge them.
