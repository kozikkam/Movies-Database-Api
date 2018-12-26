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
db['Movie'] = Movie;
const Rating = require('./rating')(sequelize);
db['Rating'] = Rating;
const Comment = require('./comment')(sequelize);
db['Comment'] = Comment;
Movie.hasMany(Rating, {as: 'ratings'});
Movie.hasMany(Comment, {as: 'comments'});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

sequelize.sync({force: false});

module.exports = db
