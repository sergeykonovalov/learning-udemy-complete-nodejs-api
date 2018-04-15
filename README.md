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