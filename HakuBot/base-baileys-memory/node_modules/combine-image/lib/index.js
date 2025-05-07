'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isPlainObj = require('is-plain-obj');

var _isPlainObj2 = _interopRequireDefault(_isPlainObj);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _calcMargin = require('./utils/calcMargin');

var _calcMargin2 = _interopRequireDefault(_calcMargin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function combineImage(images, {
    direction = 'col',
    color = 0x00000000,
    offset = 0,
    margin,
    shrink = true
} = {}) {
    if (!Array.isArray(images)) {
        throw new TypeError('`images` must be an array that contains images');
    }

    if (images.length < 1) {
        throw new Error('At least `images` must contain more than one image');
    }

    const processImg = img => {
        if ((0, _isPlainObj2.default)(img)) {
            const { src } = img;

            return (0, _jimp.read)(src).then(imgObj => ({
                img: imgObj
            }));
        }

        return (0, _jimp.read)(img).then(imgObj => ({ img: imgObj }));
    };

    direction = direction === 'row';
    const minMaxFunc = shrink ? 'min' : 'max';

    let imgs = await Promise.all(images.map(processImg));

    let imgData = imgs.reduce((res, { img }) => {
        const { bitmap: { width, height } } = img;

        res.push({
            img,
            width,
            height
        });

        return res;
    }, []);

    const width = Math[minMaxFunc](...imgData.map(el => el.width));
    const height = Math[minMaxFunc](...imgData.map(el => el.height));

    imgData = await Promise.all(imgData.map(async res => {
        try {
            res = await new Promise(resolve => {
                if (direction) {
                    res.img.resize(width, res.height / res.width * width, (err, res) => {
                        resolve(res);
                    });
                } else {
                    res.img.resize(res.width / res.height * height, height, (err, res) => {
                        resolve(res);
                    });
                }
            });
        } catch (e) {
            console.log(e);
        }
        return {
            img: res,
            width: res.bitmap.width,
            height: res.bitmap.height
        };
    }));

    const { top, right, bottom, left } = (0, _calcMargin2.default)(margin);
    const marginTopBottom = top + bottom;
    const marginRightLeft = right + left;

    const totalWidth = direction ? width : imgData.reduce((res, { width }, index) => res + width + Number(index > 0) * offset, 0);

    const totalHeight = direction ? imgData.reduce((res, { height }, index) => res + height + Number(index > 0) * offset, 0) : height;

    const baseImage = new _jimp2.default(totalWidth + marginRightLeft, totalHeight + marginTopBottom, color);

    let offsetX = 0;
    let offsetY = 0;
    for (const { img, height, width } of imgData) {
        const [px, py] = direction ? [0, offsetY + offset] : [offsetX + offset, 0];
        offsetY += height;
        offsetX += width;
        baseImage.composite(img, px + left, py + top);
    }

    return baseImage;
};

module.exports = exports['default'];