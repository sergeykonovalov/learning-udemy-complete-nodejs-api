const { SHA256 } = require('crypto-js');
const bcrypt = require('bcryptjs');
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

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
   bcrypt.hash(password, salt, (err, hash) => {
       console.log(hash);
   });
});

let hashedPassword ='$2a$10$hv9EmN0/plJ8Gz5XGQd5ouZDG.sH4c/ukNfE..ih7gJ3TreixK3Oy';
bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log('Do those match?', result);
});