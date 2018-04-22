const { SHA256 } = require('crypto-js');
let message = 'I am user number 4';
let hash = SHA256(message).toString();
console.log(`Message: ${message}`);
console.log(`Message hash: ${hash}`);

let data = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'some secret salt').toString()
};

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

let resultHash = SHA256(JSON.stringify(token.data) + 'some secret salt').toString();

if (resultHash === token.hash) {
    console.log('data was not changed');
} else {
    console.log('do not trust this data');
}