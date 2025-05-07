# combine-image

[![NPM](https://nodei.co/npm/combine-image.png)](https://nodei.co/npm/combine-image/)

> Combine multiple images into a single image

`combine-image` combines given images into a single image in right order. This will be helpful in a situation when you have to generate a preview of multiple images into a single image. This module is based on [`Jimp`] for image processing.

## Install

```bash
$ npm install combine-image
```

## Usage

```javascript
import combineImage from 'combine-image';

combineImage(['image-1.png', 'image-2.jpg'])
  .then((img) => {
    // Save image as file
    img.write('out.png', () => console.log('done'));
  });
```

## API

### combineImage(images[, options])

* `images` Array of (String | Object | Buffer | [Jimp]) - List of images to concat. If `String` is passed, it will be considered to the file path. Also you can pass other [Jimp] object. An `Object` entry can have following options:
  * `src` _`String`_ or `Buffer` - A single image source to concat.
  * `offsetX` Number (optional) - `x` offset to affect this image. Default is `0`.
  * `offsetY` Number (optional) - `y` offset to affect this image. Default is `0`.
* `options` Object (optional)
  * `direction` String - Direction of the merged image. If this value is `col`, the images will be merged vertically (col). Otherwise, If this value is `row` the images will be merged horizontally (row). Default is `col`.
  * `color` Number (hex) - Default background color represented by RGBA hex value. Default is `0x00000000`.
  * `offset` Number - Offset in pixels between each image. Default is `0`.
  * `margin` (Number | String | Object) - Margin of the result image. If `Number` or `String` is passed, it will be considered as [standard css shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) (e.g. '40 40 0 10'). An `Object` entry can have following options:
    * `top` Number (optional) - Margin on top side of result image. Default is `0`.
    * `right` Number (optional) - Margin on right side of result image. Default is `0`.
    * `bottom` Number (optional) - Margin on bottom side of result image. Default is `0`.
    * `left` Number (optional) - Margin on left side of result image. Default is `0`.

Returns a `Promise` that contains [`Jimp`] object.
