-- Create Database
CREATE DATABASE IF NOT EXISTS paista_database;

-- Use Database
USE paista_database;

-- Create Tables
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert Initial Data
INSERT INTO users (username, email, password) VALUES ('user1', 'user1@example.com', 'password1');
INSERT INTO users (username, email, password) VALUES ('user2', 'user2@example.com', 'password2');

INSERT INTO posts (title, content, user_id) VALUES ('First Post', 'Content of the first post.', 1);
INSERT INTO posts (title, content, user_id) VALUES ('Second Post', 'Content of the second post.', 2);
