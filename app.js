const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const port = 3000;

app.use(express.json());

app.listen(port);

app.post('/', (req, res) => {
    var username;
    var token;
    var userId;
    var studentNumber;

    function usernameCheck() {
        axios.get('https://api.mojang.com/users/profiles/minecraft/' + username)
            .then(response => {
                if (response.status === 204) {
                    res.status(403).send("Username not checked");
                }
                
                console.log(response.data.id);
                uuid = response.data.id;
                userId = uuid.substring(0, 8) + "-" + uuid.substring(8, 12) + "-" + uuid.substring(12, 16) + "-" + uuid.substring(16, 20) + "-" + uuid.substring(20, 32);
                tokenCheck();
            })
            .catch(error => {
                console.log(error);
                // next(error);
                res.status(403).send("Username not checked");

            });
    }

    function tokenCheck() {
        axios.get('https://epic.clow.nl/token/check/' + token)
            .then(response => {
                console.log(response.data.id);
                studentNumber = response.data.id;
                validateStudentNumber();
            })
            .catch(error => {
                console.log(error);
                // next(error);
                res.status(403).send("Token not checked.");
            });
    }

    function validateStudentNumber() {
        fs.readFile('whitelist.json', function (err, data) {
            var json = JSON.parse(data);
            var listOfStudentNumbers = [];
            json.forEach(function (entry) {
                listOfStudentNumbers.push(entry.studentNumber);
            });
            if (listOfStudentNumbers.includes(studentNumber)) {
                res.status(403).send("This student number already exists");
            } else {
                appendToWhitelist();
            }
        });
    }

    function appendToWhitelist() {
        fs.readFile('whitelist.json', function (err, data) {
            var json = JSON.parse(data);
            var toAdd = {
                uuid: userId,
                name: username,
                studentNumber: studentNumber
            };
            json.push(toAdd);

            fs.writeFile("whitelist.json", JSON.stringify(json), function (err, result) {
                if (err) {
                    console.log('error', err);
                    res.sendStatus(500);
                }
            });
            res.send("Entry succesfully added to whitelist.");
        });
    }


    req.accepts('application/json');
    if (!req.is('application/json')) {
        // Send error here
        res.sendStatus(400);
    }

    // Part 1: checking if the token and username have a correct length
    if (req.body.username.length !== 0 && req.body.username.length <= 16 && req.body.token.length === 48) {
        username = req.body.username;
        token = req.body.token;
    } else {
        res.sendStatus(403);
    }

    usernameCheck();
});


// production error handler
const HTTP_SERVER_ERROR = 500;
app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    return res.status(err.status || HTTP_SERVER_ERROR).render('500');
});