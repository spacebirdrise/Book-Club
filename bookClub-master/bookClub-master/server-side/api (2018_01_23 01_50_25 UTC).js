var express = require('express');
var router = express.Router();

var path = require('path');
var Db = require('./db.js');
var db = new Db('dbData');

//API calls

//TODO: add validation to all API calls

//GET calls
router.get('/', function (req, res, next) {
    res.status(200).sendFile(path.join(__dirname + '/../client-side/index.html'));
});
router.get('/getUser/:username', function (req, res, next) {
    //returns information about a user
    var username = req.params.username;
    //validate that username is in database
    db.getUsers(function (users) {
        for (var i = 0; i < users.length; i++) {
            if (users[i] == username) {
                //user is in database, good to retrieve information
                db.getUserInfo(username, function (userInfo) {
                    res.status(200).send(userInfo);
                });
                break;
            }
            else if (i == users.length - 1) {
                res.status(404).send({
                    'msg': 'Error: username is not in database',
                    'username': username
                });
            }
        }
    })
});
router.get('/getUsers', function (req, res, next) {
    //returns array of all usernames
    db.getUsers(function (users) {
        if (users == null) {
            res.status(404).send('Error: no users are in the database');
        }
        else {
            res.status(200).send(users);
        }
    });
});
router.get('/currentBook', function (req, res, next) {
    //returns the current book isbn, if there is no current book returns null
    db.getCurrentBook(function (isbn) {
        res.status(200).send(isbn);
    });
});
router.get('/votingBooks', function (req, res, next) {
    //returns array of ISBN numbers of books currently up for voting
    db.getVotingList(function (books) {
        res.status(200).send(books);
    });
});
router.get('/time', function (req, res, next) {
    //returns the time left on the clock and whether it is a reading or voting period
    //TODO: Figure out how the hell we gonna handle time n such
});

//POST calls
router.post('/login', function (req, res, next) {
    //verifies login info with database, sets cookie and returns 200 if good to go
    //expects req.body to have two properties: username and password
    if (req.body.username == undefined || req.body.password == undefined) {
        res.status(400).send('Faulty request, username and password required');
    }
    else {
        var username = req.body.username;
        var password = req.body.password;
        //TODO: username and/or password decryption can go here
        db.login(username, password, function (loggedIn) {
            if (loggedIn) {
                //TODO: add cookie creation here
                res.status(200).send('logged in');
            }
            else {
                res.status(404).send('username and password are not in the database');
            }
        });
    }
});
router.post('/newUser', function (req, res, next) {
    //expects req.body to have three properties: username, password, email
    if (req.body.username == undefined || req.body.password == undefined || req.body.email == undefined) {
        res.status(400).send('Faulty request: username, password, and email required');
    }
    else {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        //TODO: username and/or password decryption can go here
        //validate that usersname is unique
        db.getUsers(function (users) {
            for (var i = 0; i < users.length; i++) {
                if (users[i] == username) {
                    //username is already in the database, send a failure response
                    res.status(409).send('Conflict. Username is already in the database');
                }
                else if (i == users.length - 1) {
                    //usersname is not already in the database, ok to add
                    db.newUser(username, password, email, function (added) {
                        if (added) {
                            //user succesfully added, sign them in and continue
                            //TODO: add cookie creation here
                            res.status(200).send('registered and logged in');
                        }
                        else {
                            res.status(500).send('Server error. User was not added to the database');
                        }
                    })
                }
            }
        });
    }
});
router.post('/newVote', function (req, res, next) {
    //expects req.body to have two properties: username and isbn
    if (req.body.username == undefined || req.body.isbn == undefined) {
        res.status(400).send('Faulty request: username and isbn required');
    } else {
        //add a vote to a certain book that matches the isbn number
        //check if user has already voted
        var username = req.body.username;
        var isbn = req.body.isbn;
        db.getUserInfo(username, function (userInfo) {
            if (userInfo.currentVoteUsed === true) {
                res.status(400).send('Faulty request: user has already voted');
            } else {
                db.newVote(isbn, function (validVote) {
                    if (validVote) {
                        res.status(200).send('Vote processed');
                    }
                    else {
                        res.status(500).send('DB was unable to process vote');
                    }
                })
            }
        });
    }
});
router.post('/newBook', function (req, res, next) {
    //expects req.body to have two properties: username and isbn
    if (req.body.username == undefined || req.body.isbn == undefined) {
        res.status(400).send('Faulty request: username and isbn required');
    }
    //adds a book to the list of books to be voted on
});
router.post('/logout', function (req, res, next) {
    //TODO: Remove cookie from the client, essentially log them out
});
router.post('/delUser', function (req, res, next) {
    //expects req.body to have one property: username
    if (req.body.username == undefined) {
        res.status(400).send('Faulty request: username required');
    }
    else {
        var username = req.body.username;
        //removes a user from the database
        db.deleteUser(username, function (deleted) {
            if (deleted) {
                //user successfully deleted, remove cookie and tell them to have a nice life
                //TODO: cookie removal here
                res.status(200).send('User account succesfully removed');
            }
            else {
                res.status(500).send('Server error. User could not be removed from the database');
            }
        });
    }
});

//TODO: Add username validation helper function


module.exports = router;