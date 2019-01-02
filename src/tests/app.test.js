import chai from 'chai';
import assert from 'assert';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import server from '../..';
import userData from '../__mockData__';

dotenv.config();
chai.should();
const { expect } = chai;
chai.use(chaiHttp);


// Test for appController
describe('Population Management Controller Test', () => {
  const { user } = userData;
  // Test sign up route
  describe('User signup route', () => {
    before((done) => {
      mongoose.createConnection(
        process.env.MONGODB_URL_TEST,
        { useNewUrlParser: true }, () => {
          mongoose.connection.db.dropDatabase(() => {
            done();
          });
        },
      );
    });
    it('should signup a new user', (done) => {
      chai.request(server)
        .post('/api/v1/signup')
        .set('Content-Type', 'application/json')
        .send(user.signUp)
        .end((err, res) => {
          res.should.have.status(201);
          assert.equal(true, res.body.success);
          res.body.should.have.property('message').equals('Sign up successful');
          done();
        });
    });
    it(
      'should return status 400 if password is less than 6 characters',
      (done) => {
        chai.request(server)
          .post('/api/v1/signup')
          .set('Content-Type', 'application/json')
          .send(user.signUpErr)
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.success).to.eql(false);
            res.body.error.should
              .equals('Password length must be more than 6 characters');
            done();
          });
      },
    );
    it(
      'should return status 400 if password is less than 6 characters',
      (done) => {
        chai.request(server)
          .post('/api/v1/signup')
          .set('Content-Type', 'application/json')
          .send(user.signUpErr)
          .end((err, res) => {
            res.should.have.status(400);
            assert.equal(false, res.body.success);
            res.body.should.have.property('error')
              .equals('Password length must be more than 6 characters');
            done();
          });
      },
    );
    it(
      'should return status 400 if password not defined',
      (done) => {
        chai.request(server)
          .post('/api/v1/signup')
          .type('application/json')
          .send(user.signUpUndefinedPass)
          .end((err, res) => {
            res.should.have.status(400);
            assert.equal(false, res.body.success);
            res.body.should.have.property('error')
              .equals('Either email, password or name must not be empty');
            done();
          });
      },
    );
    it('should return status 400 if name is an empty string', (done) => {
      chai.request(server)
        .post('/api/v1/signup')
        .set('Content-Type', 'application/json')
        .send(user.signUpEmptyUsername)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(false, res.body.success);
          res.body.should.have.property('error')
            .equals('name field cannot be empty');
          done();
        });
    });
    it(
      'should return status 400 if username charcter is less than 2',
      (done) => {
        chai.request(server)
          .post('/api/v1/signup')
          .type('form')
          .send(user.shortUserName)
          .end((err, res) => {
            res.should.have.status(400);
            assert.equal(false, res.body.success);
            res.body.should.have.property('error')
              .equals('name must be more than 2 characters');
            done();
          });
      },
    );
    it('should return status 400 if email is an empty string', (done) => {
      chai.request(server)
        .post('/api/v1/signup')
        .type('form')
        .send(user.emptyEmail)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.success).to.eql(false);
          res.body.should.have.property('error')
            .equals('Email address field cannot be empty');
          done();
        });
    });
    it('should return status 400 if email is badly formatted', (done) => {
      chai.request(server)
        .post('/api/v1/signup')
        .type('form')
        .send(user.invalidEmail)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.success).to.eql(false);
          res.body.should.have.property('error')
            .equals('Email is badly formatted');
          done();
        });
    });
    it('should return status 409 if email already registered', (done) => {
      chai.request(server)
        .post('/api/v1/signup')
        .type('form')
        .send(user.existingEmail)
        .end((err, res) => {
          res.should.have.status(409);
          expect(res.body.success).to.eql(false);
          res.body.should.have.property('error')
            .equals('Email is already registered');
          done();
        });
    });
    it('should return status 400 if password is an empty string', (done) => {
      chai.request(server)
        .post('/api/v1/signup')
        .type('form')
        .send(user.emptyPassword)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.success).to.eql(false);
          res.body.error.should.equals('Password field cannot be empty');
          done();
        });
    });
  });

  // Test sign in route
  describe('User signin route', () => {
    it('should return status 400 if email or password not defined', (done) => {
      chai.request(server)
        .post('/api/v1/signin')
        .type('application/json')
        .send({ name: user.name })
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(false, res.body.success);
          res.body.should.have.property('error')
            .equals('Email or password must not be empty');
          done();
        });
    });

    it('should return status 404 if user does not exist', (done) => {
      chai.request(server)
        .post('/api/v1/signin')
        .type('application/json')
        .send({
          email: user.secondEmail,
          password: user.password,
        })
        .end((err, res) => {
          res.should.have.status(404);
          assert.equal(false, res.body.success);
          res.body.should.have.property('error')
            .equals('User does not exist');
          done();
        });
    });

    it('should return status 401 if user sends wrong password', (done) => {
      chai.request(server)
        .post('/api/v1/signin')
        .type('application/json')
        .send({
          email: user.email,
          password: user.wrongPass,
        })
        .end((err, res) => {
          res.should.have.status(401);
          assert.equal(false, res.body.success);
          res.body.should.have.property('error')
            .equals('Email or password is invalid');
          done();
        });
    });

    it('should return status 200 if a user sign in successfully', (done) => {
      chai.request(server)
        .post('/api/v1/signin')
        .type('application/json')
        .send(user.signIn)
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(true, res.body.success);
          assert.equal(res.body.userDetails.email, user.email);
          res.body.should.have.property('message')
            .equals('Sign in successful');
          done();
        });
    });
  });

  // Test to create a location route
  describe('User create a location', () => {
    let validToken = '';
    let locationId = '';
    let invalidId = '';
    before((done) => {
      chai.request(server)
        .post('/api/v1/signin')
        .send(user.signIn)
        .end((err, res) => {
          if (err) return done(err);
          validToken = res.body.token;
          done();
        });
    });
    before((done) => {
      chai.request(server)
        .post('/api/v1/locations')
        .set('x-access-token', validToken)
        .type('application/json')
        .send(user.location1)
        .end((err, res) => {
          if (err) return done(err);
          invalidId = res.body._id;
          locationId = res.body.createdLocation._id;
          done();
        });
    });

    it(
      'should return status 400 when username or email is not defined',
      (done) => {
        chai.request(server)
          .post('/api/v1/locations')
          .set('x-access-token', validToken)
          .type('application/json')
          .send(user.location)
          .end((err, res) => {
            res.should.have.status(201);
            assert.equal(true, res.body.success);
            res.body.should.have.property('message')
              .equals('Your location has been created successfully');
            done();
          });
      },
    );
    it(`should return status code 401 when user try to update profile
    with invalid token`, (done) => {
      const invalid = validToken.slice(0, -1);
      chai.request(server)
        .post('/api/v1/locations')
        .set('x-access-token', invalid)
        .type('application/json')
        .send({
          email: user.email,
          name: user.name,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('name')
            .equals('JsonWebTokenError');
          res.body.should.have.property('message')
            .equals('invalid signature');
          done();
        });
    });
    it('should return status code 409 when a location already exist', (done) => {
      chai.request(server)
        .post('/api/v1/locations')
        .set('x-access-token', validToken)
        .type('application/json')
        .send(user.location)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error')
            .equals('existingLocation');
          res.body.should.have.property('message')
            .equals('Location must be unique');
          done();
        });
    });
    it('should return status code 500 with undefined location id', (done) => {
      chai.request(server)
        .put(`/api/v1/locations/${invalidId}`)
        .set('x-access-token', validToken)
        .type('application/json')
        .send(user.location2)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should return status code 200 when update a location', (done) => {
      chai.request(server)
        .put(`/api/v1/locations/${locationId}`)
        .set('x-access-token', validToken)
        .type('application/json')
        .send(user.location2)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message')
            .equals('Location updated successfully');
          done();
        });
    });
    it('should return status code 200 when succesfully query for a location', (done) => {
      chai.request(server)
        .get(`/api/v1/locations?id=${locationId}`)
        .set('x-access-token', validToken)
        .type('application/json')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return status code 200 when query for locations', (done) => {
      chai.request(server)
        .get('/api/v1/locations')
        .set('x-access-token', validToken)
        .type('application/json')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return status 403 with no valid token provided', (done) => {
      chai.request(server)
        .post('/api/v1/locations')
        .set('x-access-token', '')
        .type('application/json')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('error')
            .equals('No valid token provided');
          done();
        });
    });
    it('should return status code 401 with invalid location id', (done) => {
      chai.request(server)
        .delete(`/api/v1/locations/${invalidId}`)
        .set('x-access-token', validToken)
        .type('application/json')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message')
            .equals('Unathorized, invalid location identity');
          done();
        });
    });
    it('should return status code 202 successfully deleted a location', (done) => {
      chai.request(server)
        .delete(`/api/v1/locations/${locationId}`)
        .set('x-access-token', validToken)
        .type('application/json')
        .end((err, res) => {
          res.should.have.status(202);
          res.body.should.have.property('message')
            .equals('Location deleted successfully');
          done();
        });
    });
  });
});
