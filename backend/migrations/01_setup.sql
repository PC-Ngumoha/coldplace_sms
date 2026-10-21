-- Create the database & db user


-- Character set specified for backward compatibility with MySQL 5.7 & MariaDB
CREATE DATABASE IF NOT EXISTS coldplace ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creating the user and granting it all privileges on the database
CREATE USER 'cp_user'@'localhost' IDENTIFIED BY 'coldplace123';

GRANT ALL PRIVILEGES ON coldplace.* TO 'cp_user'@'localhost';