const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    const Comment = sequelize.define('comment', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        body: {
            type: Sequelize.STRING
        }
      });

      return Comment;
}