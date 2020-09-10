const path = require('path');
// const index = require('../node');
// console.log('index.file: ', index.file);

const file = require('../../node/file');
// console.log('file: ', file);
const filePath = path.join(__dirname, '../../', 'temp');

console.log('default', file(filePath));
console.log('loop', file(filePath, { loop: true }));
console.log('igroneFile', file(filePath, { igroneFile: true }));
console.log('igroneDir', file(filePath, { igroneDir: true }));
console.log('igroneExp', file(filePath, { igroneExp: new RegExp(/.*(c).*/g), loop: true }));
console.log('igroneArr', file(filePath, { igroneArr: ['a.js', 'e.c', 'c'], loop: true }));
console.log('igroneEmptyDir', file(filePath, { igroneEmptyDir: true }));
console.log('json', file(filePath, { json: false }));
console.log('loop', file(filePath, { loop: true, igroneExp: /(a)/, exp: /(c)$/ }));
