const Comment = require('../models/index').comment;
const Movie = require('../models/index').movie;
const { checkForArguments } = require('./helpers');
const { movieFindOne } = require('./helpers');

module.exports = {
    async create(req, res) {
        let { id } = req.body;
        let { body } = req.body;
        
        checkForArguments({
            id,
            body
        }, res);
        
        id = parseInt(id);
        let movie = await movieFindOne({id});
        
        if(!movie){
            res.status(400);
            throw new Error("No movie with given id");
        }
        
        let comment = await Comment.create({ body });
        
        await movie.addComment(comment);
        
        res.status(200);
        return comment;
    },
    async list(req, res) {
        let conditions = {};
        
        if(req.query.movieId) {
            Object.assign(conditions, { movieId: req.query.movieId });
        }
        
        let comments = await Comment.findAll({ where: conditions });
        
        return comments;
    }
};
