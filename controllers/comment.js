const Comment = require('../models/index').comment;
const Movie = require('../models/index').movie;
const checkForArguments = require('./helpers').checkForArguments;
const movieFindOne = require('./helpers').movieFindOne;

module.exports = {
    async create(req, res) {
        let id = req.body.id;
        let body = req.body.body;
        checkForArguments({
            id: id,
            body: body
        }, res);
        id = parseInt(req.body.id);
        console.log(id);
        let movie = await movieFindOne({id: id});
        if(!movie){
            res.status(400);
            throw new Error("No movie with given id");
        }
        let comment = await Comment.create({
            body: body
        });
        await movie.addComment(comment);
        res.status(200);
        return comment;
    },
    async list(req, res) {
        let conditions = {};
        if(req.query.movieId) {
            conditions.movieId = req.query.movieId;
        }
        let comments = await Comment.findAll({
            where: conditions
        });
        return comments;
    }
};