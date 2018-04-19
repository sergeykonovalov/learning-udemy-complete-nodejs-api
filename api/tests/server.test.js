const expect = require('expect');
const request = require('supertest');
// ^^^ this is just a suggestion to rename into request, so then in test can read request(app)

const { app } = require('./../index');
const { Todo } = require('./../models/todo');

let todos = [{
    text: 'first test todo'
}, {
    text: 'second test todo'
}, {
    text: 'third test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'one test todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err)  { return done(err); };

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(4);
                    expect(todos[3].text).toBe(text);
                    done();
                }).catch((e) => done(e));
                // ^^^ this catch is for promise to find, to process any errors during it resolution
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) { return done(err); };

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
   it('should get all todos', (done) => {
       request(app)
           .get('/todos')
           .expect(200)
           .expect((res) => {
               expect(res.body.todos.length).toBe(3);
           })
           .end(done);
        // ^^^  no need to do anything here, as we are not doing anything asynchronously
   });
});