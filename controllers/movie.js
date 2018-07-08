const Movie = require('../models/index').movie;
const Rating = require('../models/index').rating;
const Sequelize = require('../models/index').Sequelize;
const config = require('../config/config');
const requestJson = require('./helpers').requestJson;
const getHoursDifference = require('./helpers').getHoursDifference;
const getOrCreateRating = require('./helpers').getOrCreateRating;
const checkForArguments = require('./helpers').checkForArguments;
const movieFindOne = require('./helpers').movieFindOne;
const movieFindAll = require('./helpers').movieFindAll;

function getMovieValuesFromData(data){
    return {
        title: data["Title"],
        year: parseInt(data["Year"]) || data["Year"],
        rated: data["Rated"],
        released: data["Released"],
        runtime: data["Runtime"],
        genre: data["Genre"],
        director: data["Director"],
        writer: data["Writer"],
        actors: data["Actors"],
        plot: data["Plot"],
        language: data["Language"],
        country: data["Country"],
        awards: data["Awards"],
        poster: data["Poster"],
        metascore: parseInt(data["Metascore"]) || data["Metascore"],
        imdbRating: parseFloat(data["imdbRating"]) || data["imdbRating"],
        imdbVotes: data["imdbVotes"]?parseInt(data["imdbVotes"].replace(",", "")): data["imdbVotes"],
        imdbID: data["imdbID"],
        type: data["Type"],
        dvd: data["DVD"],
        boxOffice: data["BoxOffice"],
        production: data["Production"],
        website: data["Website"]};
}

async function updateOrCreateMovie(title, res, cached=undefined) {
    let data = await requestJson(config['omdbapi']+`?apikey=${config['developerKey']}&t="${title}"`);
    let values = getMovieValuesFromData(data);
    if(cached) {
        cached = await cached.update(values);
        res.status(200);
        return cached;
    }
    else {
        res.status(201);
    }
    let foundTitle = values.title;
    if(!foundTitle) {
        res.status(400);
        throw new Error("Title does not match any movie");
    }
    cached = await Movie.create(values);
    await createAndBindRatingsFromData(cached, data);
    return await movieFindOne({title: foundTitle});
}

async function createAndBindRatingsFromData(movie, data){
    await movie.setRatings([]);
    for(const idx in data["Ratings"]) {
        let value = {
            source: data["Ratings"][idx]["Source"],
            value: data["Ratings"][idx]["Value"]
        };
        let rating = await getOrCreateRating(value, value);
        movie.addRating(rating);
    }
}

module.exports = {
    async create(req, res) {
        let title = req.body.title;
        checkForArguments({title}, res);

        // check if already in database
        let cached = await movieFindOne({title});
        if(cached) {
            // update if entry older than 24 hours
            console.log(cached.updatedAt);
            if(getHoursDifference(new Date(), cached.updatedAt) > 24) {
                console.log("returning updated movie");
                return await updateOrCreateMovie(title, res, cached);
            }
            console.log("returning cached movie");
            res.status(200);
            return cached;
        }
        // if not, request
        console.log("returning new movie");
        return await updateOrCreateMovie(title, res);
    },
    async list(req, res) {
        const Op = Sequelize.Op
        let conditions = {};
        if(req.query.id) {
            conditions.id = parseInt(req.query.id);
        }
        // need something better for parsing such arguments
        if(req.query.year) { 
            if(req.query.year.gt || req.query.year.lt) {
                if(req.query.year.gt){
                    conditions.year = {[Op.gt]: parseInt(req.query.year.gt)};
                }
                if(req.query.year.lt){
                    conditions.year = {[Op.lt]: parseInt(req.query.year.lt)};
                }
            }
            else {
                conditions.year = parseInt(req.query.year);
            }
        }
        return await movieFindAll(conditions);
    }
};