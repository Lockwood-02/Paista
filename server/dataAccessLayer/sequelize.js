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
const Topics = sequelize.define('Topics', {
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
const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
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

// Define the Posts model with foreign key constraints
const Posts = sequelize.define('Posts', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Creator_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Referencing the Users table
            key: 'id'      // Referencing the ID column in the Users table
        }
    },
    Thread_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Posts', // Referencing the Posts table
            key: 'ID'      // Referencing the ID column in the Posts table
        }
    },
    Topic_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Topics', // Referencing the Topics table
            key: 'id'       // Referencing the ID column in the Topics table
        }
    },
    Solution_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Posts', // Referencing the Posts table
            key: 'ID'      // Referencing the ID column in the Posts table
        }
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Type: {
        type: DataTypes.ENUM('Announcement', 'Resolved', 'Unresolved'),
        allowNull: false
    }
});

// Define associations for Posts
Posts.belongsTo(Users, { foreignKey: 'Creator_ID', onDelete: 'NO ACTION' });
Posts.belongsTo(Topics, { foreignKey: 'Topic_ID', onDelete: 'NO ACTION' });


// Define the Access model with foreign key constraints
const Accesses = sequelize.define('Accesses', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Users_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Topic_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Access_Type: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define the foreign key constraints for Accesses
Accesses.belongsTo(Users, { foreignKey: 'Users_ID' });
Accesses.belongsTo(Topics, { foreignKey: 'Topic_ID' });


// Define the TitleHistories model with foreign key constraints
const TitleHistories = sequelize.define('TitleHistory', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Previous_Title: {
        type: DataTypes.STRING,
        allowNull: false // Assuming previous title cannot be null
    },
    Timestamp: {
        type: DataTypes.DATE,
        allowNull: false // Assuming timestamp cannot be null
    }
});

// Define associations for TitleHistories
TitleHistories.belongsTo(Topics, { foreignKey: 'Topic_ID', onDelete: 'CASCADE' });


// Define the Votes model with foreign key constraints
const Votes = sequelize.define('Votes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

const EditHistories = sequelize.define('EditHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    previousEdit: DataTypes.STRING,
    timestamp: DataTypes.DATE
});

// Define associations between models if necessary

// Synchronize Sequelize models with the database
sequelize.sync({logging:false})
  .then(() => {
    console.log('Tables synchronized successfully');
    // Your application logic here
  })
  .catch((error) => {
    console.error('Error synchronizing tables:', error);
  });

module.exports = {
    sequelize,
    Topics,
    Users,
    Posts,
    Accesses,
    TitleHistories,
    Votes,
    EditHistories
};