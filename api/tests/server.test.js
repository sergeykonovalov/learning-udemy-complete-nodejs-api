const expect = require('expect');
const request = require('supertest');
// ^^^ this is just a suggestion to rename into request, so then in test can read request(app)

const { app } = require('./../index');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { ObjectID } = require('mongodb');
const { todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        /*
        - Sends sample text to app route
        - Expects to get 200
        - Expects that response body text property to be same as sample text
        - In the end try with a promise  to find all todos
            - then expect number to be +1
            - and last in array to have same text as sample
        - If something fails, then handle in catch
         */
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

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should return 400 for invalid id', (done) => {
    let invalidId = '12345';
    request(app)
      .get(`/todos/${invalidId}`)
      .expect(400)
      .end(done);
  });
  it('should return 404 if no record found', (done) => {
    let randomObjectId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${randomObjectId}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();
    console.log(hexId)
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((res) => {
          // expect(null).toNotExist();
          expect(res).toNotExist();
          done();
        }).catch((e) => {
          done(e);
        });
      })
  });
  it('should return 404 if todo not found', (done) => {
    let randomId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${randomId}`)
    .expect(404)
    .end(done);
  });
  it('should return 400 if id is invalid', (done) => {
    let invalidId = '123';
    request(app)
    .delete(`/todos/${invalidId}`)
    .expect(400)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let testTodoId = todos[0]._id.toHexString();
    let text = 'Updated from test';
    let body = { text, completed: true };
    request(app)
      .patch(`/todos/${testTodoId}`)
      .send(body) // or can send object {} with properties right here
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });
  it('should clear completedAt when todo is not completed', (done) => {
    let testTodoId = todos[1]._id.toHexString();
    let text = 'Updated from another test';
    let body = { text, completed: false };
    request(app)
      .patch(`/todos/${testTodoId}`)
      .send(body) // or can send object {} with properties right here
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('POST /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users/me', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123abc!';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then((user) => {
                   expect(user).toExist();
                   expect(user.password).toNotBe(password);
                   done();
                }).catch((e) => done(e));
            });
    });
    it('should return validation error if request invalid', (done) => {
        let email = 'a@b';
        let password = 'qwerty';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
    it('should not create user if email in use', (done) => {
        let email = users[0].email;
        let password = '123abc!';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(409)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                   expect(user.tokens[0]).toInclude({
                       access: 'auth',
                       token: res.headers['x-auth']
                   });
                   done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'some@nonexisten.com',
                password: '123cba!@#'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
   it('should remove auth token on logout', (done) => {
       request(app)
           .delete('/users/me/token')
           .set('x-auth', users[0].tokens[0].token)
           .expect(200)
           .end((err, res) => {
               if (err) {
                   return done(err);
               }
               User.findById(users[0]._id).then((user) => {
                       expect(user.tokens.length).toBe(0);
                       done();
                   }).catch((e) => done(e));
           });
   });
});
