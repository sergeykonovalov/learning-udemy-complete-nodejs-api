const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    // For Mongo 3 replace:
    // (err, db) with (err, client)
    if (err) {
        // Use of return statement stops execution of code underneath
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // For Mongo 3 add line:
    // const db = client.db(TodoApp);

    db.collection('Todos').find().toArray().then((documents) => {
        console.log('Query All Todos');
        console.log(JSON.stringify(documents, undefined, 2));
    }, (error) => {
        console.log('Unable to fetch Todos', error);
    });

    db.collection('Todos').find({_id: new ObjectID('5ad65e45212fa5042c1ca236'), completed: true}).toArray().then((documents) => {
        console.log('Query Completed Todos');
        console.log(JSON.stringify(documents, undefined, 2));
    }, (error) => {
        console.log('Unable to fetch Todos', error);
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (error) => {
        console.log('Unable to fetch Todos', error);
    });

    let requestedName = 'Sergey';

    db.collection('Users').find({name: requestedName}).count().then((count) => {
        console.log(`Users with name ${requestedName}: ${count}`);
    }, (error) => {
        console.log('Unable to fetch Users', error);
    });

    db.close();
    // For Mongo 3 replace:
    // db.close() with client.close()
});