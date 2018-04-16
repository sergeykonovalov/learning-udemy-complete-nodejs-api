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

## ObjectID

E.g. `5ad51f069db38e7c8e791f11` turns into `5ad51f06-9db38e-7c8e-791f11`:

- 4 bytes = time stamp
- 3 bytes = machine identifier
- 2 bytes = process identifier
- 3 bytes = counter

> ObjectID is how MongoDB creates id by default, but value of `_id` property can be *anything*, e.g. `123`, this is still perfectly legal.