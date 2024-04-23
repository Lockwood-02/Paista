require('dotenv').config();

//initialize obj
let storageStr = process.env.NODE_ENV == 'test' ? 'test.sqlite' : 'database.sqlite';
// Establish a connection to the database
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storageStr
});
// If using online storage, replace the above with:
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

// Define the Users model
const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    userClass: DataTypes.INTEGER,
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

const Topics = sequelize.define('Topics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Default value if not provided
    },
    closed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Default value if not provided
    },
    dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Default value if not provided
    }
});

// Define associations
Users.hasMany(Topics, { foreignKey: 'userID' });

// Define the association between Users and Topics
Topics.belongsTo(Users, { foreignKey: 'userID' });


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
const TitleHistories = sequelize.define('TitleHistories', {
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


// Define the EditHistories model with foreign key constraints
const EditHistories = sequelize.define('EditHistory', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Post_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts',
            key: 'ID'
        }
    },
    Previous_Edit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'EditHistories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations for EditHistories
EditHistories.belongsTo(Posts, { foreignKey: 'Post_ID', onDelete: 'CASCADE' });


// Define the Votes model with foreign key constraints
const Votes = sequelize.define('Votes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    User_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    Post_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

// Add foreign key constraints for User_ID and Post_ID
Votes.belongsTo(Users, { foreignKey: 'User_ID', onDelete: 'CASCADE' });
Votes.belongsTo(Posts, { foreignKey: 'Post_ID', onDelete: 'CASCADE' });



// Synchronize Sequelize models with the database
sequelize.sync({logging:false})
  .then(() => {
    //console.log('Tables synchronized successfully');
    // Your application logic here
  })
  .catch((error) => {
    console.error('Error synchronizing tables:', error);
  });

module.exports = {
    sequelize,
    Users,
    Posts,
    Accesses,
    TitleHistories,
    Votes,
    EditHistories,
    Topics
};



