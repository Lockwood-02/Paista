//initialize obj

// Establish a connection to the database
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});
// If using online storage, replace the above with:
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

// Define the Topic model
const Topic = sequelize.define('Topic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255] // Ensure title length is between 1 and 255 characters
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 1000] // Ensure description length is between 1 and 1000 characters
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

// Define other necessary models such as User, Post, Access, TitleHistory, Votes, and EditHistory
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: { // Updated username to set restrictions
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ensure usernames are unique
      },
      password: { // Updated password so that it cannot be null
        type: DataTypes.STRING,
        allowNull: false
      },
    class: DataTypes.INTEGER,
    banned: DataTypes.BOOLEAN,
    dateCreated: DataTypes.DATE,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true // Ensure email format is valid
        }
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
});

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN,
    anonymous: DataTypes.BOOLEAN,
    type: DataTypes.STRING
});

const Access = sequelize.define('Access', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    accessType: DataTypes.STRING
});

const TitleHistory = sequelize.define('TitleHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    previousTitle: DataTypes.STRING,
    timestamp: DataTypes.DATE
});

const Votes = sequelize.define('Votes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

const EditHistory = sequelize.define('EditHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    previousEdit: DataTypes.STRING,
    timestamp: DataTypes.DATE
});

// Define associations between models if necessary

module.exports = {
    sequelize,
    Topic,
    User,
    Post,
    Access,
    TitleHistory,
    Votes,
    EditHistory
};