const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,
    logging: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // For now we are going to assume only sqlite as dialect
    storage: __dirname + `/database/${config.database}.sqlite`
});

const db = {};

const Movie = require('./movie')(sequelize);
db[Movie.name] = Movie;
const Rating = require('./rating')(sequelize);
db[Rating.name] = Rating;
const Comment = require('./comment')(sequelize);
db[Comment.name] = Comment;
Movie.hasMany(Rating, {as: 'ratings'});
Movie.hasMany(Comment, {as: 'comments'});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

sequelize.sync({force: false});

module.exports = db