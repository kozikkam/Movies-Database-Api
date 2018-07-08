const db = require('../models/index');
const config = require('../config/config');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const assert = chai.assert;
const nock = require('nock');
const mockedReply = require('./mock/mockResponse');

describe('Comments', () => {
    describe('Without movies in the database', () => {
        before(done => {
            db.sequelize.sync({force: true}).then(() => done());
        });

        describe('/GET comment', () => {
            it('it should GET all the comments', (done) => {
                chai.request(app)
                .get('/comments')
                .end((err, res) => {
                    assert.equal(res.statusCode, 200);
                    assert.equal(res.body.length, 0);
                    done();
                });
            });
        });

        describe('/POST comment', () => {
            it('it should not POST comment, because no id specified', (done) => {
                let body = {
                    id: '',
                    body: "Test comment"
                };
                chai.request(app)
                .post('/comments')
                .send(body)
                .end((err, res) => {
                    assert.equal(res.statusCode, 400);
                    assert.isObject(res.body);
                    assert.isEmpty(res.body);
                    done();
                });
            });

            it('it should not POST comment, because no body specified', (done) => {
                let body = {
                    id: 1,
                    body: ''
                };
                chai.request(app)
                .post('/comments')
                .send(body)
                .end((err, res) => {
                    assert.equal(res.statusCode, 400);
                    assert.isObject(res.body);
                    assert.isEmpty(res.body);
                    done();
                });
            });

            it('it should not POST comment, because movie id not found', (done) => {
                let body = {
                    id: 1,
                    body: "Test comment"
                };
                chai.request(app)
                .post('/comments')
                .send(body)
                .end((err, res) => {
                    assert.equal(res.statusCode, 400);
                    assert.isObject(res.body);
                    assert.isEmpty(res.body);
                    done();
                });
            });
        });
    });

    describe('With movies in the database', () => {
        before((done) => {
            db.movie.create(mockedReply).then(() => done());
        });

        describe('/POST comment', () => {
            it('it should POST comment', (done) => {
                let body = {
                    id: 1,
                    body: "Test comment"
                };
                chai.request(app)
                .post('/comments')
                .send(body)
                .end((err, res) => {
                    assert.equal(res.statusCode, 200);
                    assert.isObject(res.body);
                    assert.isNotEmpty(res.body);
                    assert.property(res.body, 'body');
                    done();
                });
            });
        });
        describe('/GET comment', () => {
            it('it should GET all the comments', (done) => {
                chai.request(app)
                .get('/comments')
                .end((err, res) => {
                    assert.equal(res.statusCode, 200);
                    assert.equal(res.body.length, 1);
                    done();
                });
            });
        });
    });
});
