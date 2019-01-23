const { movies, comments } = require('../controllers/index');

module.exports = (app) => {
    app.get('/', (req, res) => { res.status(200).send('index') });
    app.post('/movies', (req, res) => {
        movies.create(req, res)
            .then(data => res.send(data))
            .catch((err) => { console.log(err); res.send(err); });
    });
    app.get('/movies', (req, res) => {
        movies.list(req, res)
            .then(data => res.status(200).send(data))
            .catch((err) => { console.log(err); res.send(err); });
    });
    app.post('/comments', (req, res) => {
        comments.create(req, res)
            .then(data => res.send(data))
            .catch((err) => { console.log(err); res.send(err); });
    });
    app.get('/comments', (req, res) => {
        comments.list(req, res)
            .then(data => res.status(200).send(data))
            .catch((err) => { console.log(err); res.send(err); });
    });
}
