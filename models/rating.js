const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    const Rating = sequelize.define('rating', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        source: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        }
      });

      return Rating;
}