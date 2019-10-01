var mysql = require('mysql');

var Db = function (dbConnectInfo) {
    /*
    this.connection = mysql.createConnection({
        host: dbConnectInfo.host,
        user: dbConnectInfo.user,
        password: dbConnectInfo.password,
        database: dbConnectInfo.database
    });
    */
    this.info = dbConnectInfo;
}

Db.prototype.users = ['larry', 'sarah', 'douche'];

//get db calls
Db.prototype.getUserInfo = function (username, callback) {
    //query database for username, return accompanying info in JSON
    return callback(username + 'info and such');
}
Db.prototype.getUsers = function (callback) {
    //query database for list of usernames, return as an array
    return callback(this.users);
}
Db.prototype.getCurrentBook = function (callback) {
    //query database for current book, return isbn number or null
    return callback('currentbookisbnhere');
}
Db.prototype.getVotingList = function (callback) {
    //query database for list of books in the voting queue (array of ISBNs)
    return callback('voting list here');
}
/*Db.prototype.getTime = function () {

}*/

Db.prototype.login = function (username, password, callback) {
    //query database for valid (decoded) username and password, return true or false
    return callback(true);
}
Db.prototype.newUser = function (username, password, email, callback) {
    //add new user to database, return true upon sucessful add
    return callback(true);
}
Db.prototype.newVote = function (isbn, callback) {
    //add a new vote to isbn number in question
    return callback('vote added to isbn')
}
Db.prototype.newBook = function (isbn, callback) {
    //add a new book to the voting list
    return callback('new book added to voting list')
}
Db.prototype.deleteUser = function (username, callback) {
    //remove user from database
    return callback('user deleted from database');
}


module.exports = Db;