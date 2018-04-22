# Learning Node Express REST API

> Based on [Andrew Mead course on Node.js](https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview) on Udemy.

## Docker Compose

Application and database are ready to use with pre-configured Docker Compose file. Just run:

```shell
docker-compose up
```

During first run it will take time to fetch images, but afterwards building will run much faster. To re-build containers with application and database, run:

```shell
docker-compose build
```

## Connecting to Mongo

Will be using [Mongo native driver](https://github.com/mongodb/node-mongodb-native).

Some additional documentation is [available on site](http://mongodb.github.io/node-mongodb-native/), as well as [detailed API description](http://mongodb.github.io/node-mongodb-native/3.0/api/).

### Install Mongo

```shell
npm install mongodb@2.2.5 --save
```

To run a separate Docker container with MongoDB:

```shell
docker run --name local-mongo -p 27017:27017 -v mongodata:/data/db -d mongo
```

## ObjectID

E.g. `5ad51f069db38e7c8e791f11` turns into `5ad51f06-9db38e-7c8e-791f11`:

- 4 bytes = time stamp
- 3 bytes = machine identifier
- 2 bytes = process identifier
- 3 bytes = counter

> ObjectID is how MongoDB creates id by default, but value of `_id` property can be *anything*, e.g. `123`, this is still perfectly legal.

> Note that Mongoose can accept just string of ObjectID and convert it for you.

## Destructuring

Destructuring is a way to pull out properties of object turning them into variables.

```javascript
let user = { id: 123, name: 'Sergey' };
let { name } = user;
```

### Reading from Database

- Method `.find()` returns MongoDB cursor.
- Method `.toArray()` of cursor returns a promise.
- Note use of `new ObjectID('id')`, not just ID as string.
- Method `.count()` returns number of records found.

### Deleting from Database

`CommandResult` object has property `.result` which is also object with properties:
- `ok` (things go as expected if == 1)
- `n` (number of records affected; will be 0 if none affected)

Method `.deleteOne` works exactly as `.deleteMany` but only deletes first element, then stops.

### Updating Database

Method `.findOneAndUpdate` returns Promise if no callback sent.
> Additional information on method available in [official documentation](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/).

## Mongoose

> [www.mongoosejs.com](www.mongoosejs.com)

### Installation

```shell
npm i mongoose@4.5.9 --save
```

Mongoose manages connection, so developer does not need to worry about it.

### Validators

> More information about validation available in [official documentation](http://mongoosejs.com/docs/validation.html) and on page related to [schemas](http://mongoosejs.com/docs/guide.html).

Note: if you provide number instead of string, it still will work (but Mongoose will cast it to string); but will fail if you try to provide an object.

## Building REST API

> Install `body-parser` to parse HTML body into object.

```shell
npm i body-parser@1.15.2 --save
```

> Complete list of statuses can find at www.httpstatuses.com.

### Test Suite for API

Install `expect` for assertions and `mocha` for test suite, `supertest` to test our Express routes and `nodemon`.

```shell
npm i expect@1.20.2 mocha@3.0.2 nodemon@1.10.2 supertest@2.0.0 --save-dev
```

Note that unlike before passing `done` as argument to `.end`, we pass a function, which includes error and response.

Run suite with `npm run test-watch`.

To start monitoring changes run `nodemon index.js`.

> QUESTION: When I have two it() tests are they async? Will they be executed one after another in order?

> QUESTION: Why we write like that, why not avoid wrapper for res?

> QUESTION: Why do we need to convert ID with .toHexString()?

```javascript
.expect((res) => {
  expect(res.body.todo.text).toBe(todos[0].text);
})
```

### Removing Records in DB

Note, that it is possible to remove all records by running `Model.remove({})`.

To generate random records in database, use `faker` package:

```shell
npm i faker --save
```

> TODO: Resolve UnhandledPromiseRejectionWarning when running tests.

### Updating Records

#### Install Lodash

```shell
npm i lodash --save
```

## Validation of Model Properties

> Refer to [official Mongoose validation page](http://mongoosejs.com/docs/validation.html).

```shell
npm install validator@5.6.0 --save
```

## Authentication

To use encrtypton algorithms, we need to install module:

```shell
npm install crypto-js@3.1.6 --save
```

Crypto-JS used for learning purposes, while in production we will be using another module:

```shell
npm install jsonwebtoken@7.1.9 --save
```

### How Web Token Works

> Defined by RFC 7519.

- JWT structure is simple: header.payload.signature
- User authenticates at service and gets JWT back
  - Header includes type (`typ`) and algorithm (`alg`)
  - Payload might be any data, e.g. user ID (each property in payload called a claim); typical types of claims are `iss` for issuer, `sub` for subject, and `exp` for expiration time (must be after current time), `jti` for unique identifier (for one-time tokens), `iat` time stamp when token issued, `nbf` earliest time when token can be accepted, 
    - Beware of size! This might negatively affect performance of application
  - Signature is `hash(base64urlEncode(data) + base64urlEncode(payload))`
  - Put all three together, connecting with `.` dot.
  - JWT sent as header: `Authorization: Bearer <token>`

  Then *authentication* server and *application* know about the *secret key* they apply together with hashing function. So if someone who got the token, changes payload to replace user ID or permissions and try to "pretend" valid, hash calculation will fail and thus application system knows it should not trust that data.

  Advantage is that authentication and application systems only need to know the secret, and then can calculate hash, and then decide if should trust token or not.

  Read https://medium.com/vandium-software/5-easy-steps-to-understanding-json-web-tokens-jwt-1164c0adfcec to unerstand the explanation.

  > Purpose of JWT is **not** to hide or obscure data, as it is **encoded**, **signed**, but **not encrypted**.

  Note that `jwt.verify()` will throw an exception "JsonWebTokenError: invalid signature" if token is not valid.

  > QUESTION: What if secret key compromised? What are next steps? Invalidate all tokens? 