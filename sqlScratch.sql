use finalProject;

CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` varchar(25) DEFAULT 'admin',
  `_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `LifeValues` (
	id int(11) NOT NULL AUTO_INCREMENT,
    `valueName` varchar(50) NOT NULL,
    `isLowerSelf` boolean NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE UsersMetrics (

	userid INT NOT NULL,
    valueid INT NOT NULL,
    FOREIGN KEY (valueid) REFERENCES LifeValues(id),
    FOREIGN KEY (userid) REFERENCES Users(id),
    PRIMARY KEY (userid, valueid),
    valueName varchar(100) NOT NULL,
    personalDefinition varchar(500) NOT NULL,
    congruenceRating INT(10) NOT NULL,
    level10Definition varchar(500) NOT NULL,
    priority INT(10) NOT NULL,
    percentPositive int(3) NOT NULL,
    percentNegative int(3) NOT NULL
);




-- example: Join Books and Categories, join on catetgoryid

CALL getBooksJoined();


DELIMITER //
CREATE PROCEDURE getBooksJoined()
    BEGIN
        SELECT b.id as book_id, b.categoryid as b_catid, b.title as b_title, b.author as b_author, 
        b.price as b_price, b._created as b_created, c.name as cat_name
        FROM Books b
            JOIN Categories c
                ON b.categoryid=c.id
                ORDER BY b._created DESC;
    END //
    DELIMITER //;