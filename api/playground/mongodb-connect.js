const MongoClient = require('mongodb').MongoClient;

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

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert Todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'Sergey',
        age: 35,
        location: 'Saint Petersburg'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert User', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());
    });

    db.close();
    // For Mongo 3 replace:
    // db.close() with client.close()
});