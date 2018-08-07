const db = require('../models/index');
const config = require('../config/config');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const assert = chai.assert;
const nock = require('nock');

var mockedReply = require('./mock/mockResponse');
const movieTitle = mockedReply.Title;

chai.use(chaiHttp);
//Our parent block
describe('Movies', () => {
    before(done => {
        db.sequelize.sync({force: true}).then(() => done());
    });

    /*beforeEach(done => {
        nock(config.omdbapi)
            .get(() => true)
            .reply(200, mockedReply);
        done();
    });*/

    describe('/GET movie', () => {
        it('it should GET all the movies', (done) => {
            chai.request(app)
            .get('/movies')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.length, 0);
                done();
            });
        });
    });

    describe('/POST movie', () => {
        it('it should not POST a single movie without title', (done) => {
            let movie = {
                title: ''
            }
            chai.request(app)
            .post('/movies')
            .send(movie)
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                assert.isObject(res.body);
                assert.isEmpty(res.body);
                db.movie.findAll().then((result) => {assert.equal(result.length, 0); done()});
            });
        });

        it('it should POST a single movie from title', (done) => {
            nock(config.omdbapi)
                .get(() => true)
                .reply(200, mockedReply);
            let movie = {
                title: movieTitle
            }
            chai.request(app)
            .post('/movies')
            .send(movie)
            .end((err, res) => {
                assert.equal(res.statusCode, 201);
                assert.isObject(res.body);
                assert.isNotEmpty(res.body);
                assert.property(res.body, 'title');
                db.movie.findAll().then((result) => {assert.equal(result.length, 1); done()});
            });
        });

        it('it should return a cached instance', (done) => {
            let movie = {
                title: movieTitle
            }
            chai.request(app)
            .post('/movies')
            .send(movie)
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                assert.isObject(res.body);
                assert.isNotEmpty(res.body);
                assert.property(res.body, 'title');
                assert.equal(res.body.title, movieTitle);
                db.movie.findAll().then((result) => {assert.equal(result.length, 1); done()});
            });
        });

        it('it should return an updated, cached instance', (done) => {
            let writer = "TestWriter";
            mockedReply.Writer = writer;
            nock(config.omdbapi)
                .get(() => true)
                .reply(200, mockedReply);
            let movie = {
                title: movieTitle
            }
            db.movie.findOne({where: {title: movieTitle}}).then(movieObject => {
                // substract one day from updated at
                let now = new Date();
                db.sequelize.query(
                    'UPDATE movies SET updatedAt=?',
                    { 
                        raw: true,
                        replacements: [`${now.getFullYear()}-${now.getMonth()}-${now.getDate()-1} 20:00:00.000 +00:00`]
                });

                chai.request(app)
                .post('/movies')
                .send(movie)
                .end((err, res) => {
                    assert.equal(res.statusCode, 200);
                    assert.isObject(res.body);
                    assert.isNotEmpty(res.body);
                    assert.property(res.body, 'title');
                    assert.equal(res.body.title, movieTitle);
                    assert.equal(res.body.writer, writer);
                    db.movie.findAll().then((result) => {assert.equal(result.length, 1); done()});
                });
            })
        });
    });

    describe('/GET movie', () => {
        it('it should GET all the movies', (done) => {
            chai.request(app)
            .get('/movies')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.length, 1);
                done();
            });
        });
    });
});