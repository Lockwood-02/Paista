//initialize obj
const { Sequelize, DataTypes } = require('sequelize');

//connect to db
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
})
//for online storage replace above with:
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') //example: postgres

//define Datatypes, probably break this out into another .js file and import it for cleanness
const Topic = sequelize.define('Topic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: DataTypes.TEXT,
    description: DataTypes.TEXT
});

module.exports = {
    sequelize,
    Topic
}