# osPoly - openscad-poly-tools
A library to manipulate OpenSCAD Polyhedrons

[![npm](https://img.shields.io/npm/v/openscad-poly-tools.svg)](https://www.npmjs.com/package/openscad-poly-tools) 

This library is still in development (pre 1.0.0) and may change *significantly* between minor versions.
Once it reaches 1.0.0 all breaking changes will use a major revision number.

## Motivation
After importing an STL into OpenSCAD with [http://jsfiddle.net/Riham/yzvGD/](http://jsfiddle.net/Riham/yzvGD/) I realized there was a significant duplication of points.

### JSFiddle Update
I also [forked the original JSFiddle](http://jsfiddle.net/_sir/yzvGD/595/) with a version that eliminates the extra vertices.
The changes in the JSFiddle are not related to the `.simplify()` command created below, but import functionality is planned.


## Functions

### Simplify Functions

#### reportDuplicatePercentage(model)
Give the percentage of duplicates in the array of points. No changes are made.

```javascript
osPoly.reportDuplicatePercentage(myModel);
```

#### simplify(model)
Eliminate duplicate points in the model's `points` array and re-map the indices in the `faces` to match.

```javascript
osPoly.simplify(myModel);
```

### Translate Functions

### centerOnAxis(model, axis)
Move the center (average of the highest and lowest points) of a model to the origin of the specified axis.

```javascript
osPoly.centerOnAxis(myModel, 'x')
```

#### moveToOrigin(model, axis, [moveTop])
Move the lowest or highest point on an axis to the origin.

```javascript
osPoly.moveToOrigin(myModel, 'z')
```

#### translate(model, vector)
Shift the model along one or more axes.

```javascript
osPoly.translate(myModel, { x: 10, y: -2, z: 0.25 });
```

### Edit


#### filterForMatch(model, predicate)
Get only the faces of the model which have points matching the predicate.

**NOTE:** This is not the same as a Boolean operation in OpenSCAD. Any faces that have points eliminated by the predicate will be removed, not modified.

```javascript
osPoly.filterForMatch(myModel, (point) => point.x > 0);
``` 
  
#### removeDeadPoints(model)
Eliminate any dead points and correct the indices of the faces to match.

```javascript
osPoly.removeDeadPoints(myModel);
```

## Notes

As of 0.6.0, all exposed functions take a model, which is an object with arrays of points and faces.

```javascript
myModel = {
  points: [...],
  faces: [...],
};
```

Where an axis is specified, the library should accept the string `'x'`, `'y'`, or `'z'`; or their
index `0`, `1`, or `2`, respectively.


## Goals
* ~~Perform simple, brute-force point de-duplication on polyhedrons.~~
* ~~Move objects~~
* ~~Cut parts of an object~~
* ~~Provide a consistent interface for all functions~~
* Incorporate the importer from https://www.thingiverse.com/thing:62666
* Identify faces sharing points in the same plane and merge them
