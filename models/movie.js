const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    const Movie = sequelize.define('movie', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        year: {
            type: Sequelize.INTEGER
        },
        rated: {
            type: Sequelize.STRING
        },
        released: {
            type: Sequelize.STRING
        },
        runtime: {
            type: Sequelize.STRING
        },
        genre: {
            type: Sequelize.STRING
        },
        director: {
            type: Sequelize.STRING
        },
        writer: {
            type: Sequelize.STRING
        },
        actors: {
            type: Sequelize.STRING
        },
        plot: {
            type: Sequelize.STRING
        },
        language: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING
        },
        awards: {
            type: Sequelize.STRING
        },
        poster: {
            type: Sequelize.STRING
        },
        metascore: {
            type: Sequelize.INTEGER
        },
        imdbRating: {
            type: Sequelize.DOUBLE
        },
        imdbVotes: {
            type: Sequelize.INTEGER
        },
        imdbID: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        dvd: {
            type: Sequelize.STRING
        },
        boxOffice: {
            type: Sequelize.STRING
        },
        production: {
            type: Sequelize.STRING
        },
        website: {
            type: Sequelize.STRING
        }
    });
    
    return Movie;
}