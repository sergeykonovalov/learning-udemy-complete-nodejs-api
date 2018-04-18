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

