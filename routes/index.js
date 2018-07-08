const moviesController = require('../controllers/index').movies;
const commentsController = require('../controllers/index').comments;

module.exports = (app) => {
    app.get('/', (req, res) => {res.status(200).send('index')});
    app.post('/movies', (req, res) => {
        moviesController.create(req, res)
            .then(data => res.send(data))
            .catch(err => {console.log(err); res.send(err)});
    });
    app.get('/movies', (req, res) => {
        moviesController.list(req, res)
            .then(data => res.status(200).send(data))
            .catch(err => {console.log(err); res.send(err)});
    });
    app.post('/comments', (req, res) => {
        commentsController.create(req, res)
            .then(data => res.send(data))
            .catch(err => {console.log(err); res.send(err)});
    });
    app.get('/comments', (req, res) => {
        commentsController.list(req, res)
            .then(data => res.status(200).send(data))
            .catch(err => {console.log(err); res.send(err)});
    });
}
