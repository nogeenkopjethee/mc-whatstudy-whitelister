const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const port = 3000;

app.use(express.json());

app.listen(port);


app.post('/', (req, res, next) => {
    var username;
    var token;
    var userId;
    var studentNumber;

    function usernameCheck() {
        axios.get('https://api.mojang.com/users/profiles/minecraft/' + username)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data.id);
                    uuid = response.data.id;
                    userId = uuid.substring(0, 8) + "-" + uuid.substring(8, 12) + "-" + uuid.substring(12, 16) + "-" + uuid.substring(16, 20) + "-" + uuid.substring(20, 32);
                    tokenCheck();
                } else {
                    next("Username not found.");
                }
            })
            .catch(error => {
                console.log(error);
                next(error);
                // return next(new Error([error]));
            });
    }

    function tokenCheck() {
        axios.get('https://epic.clow.nl/token/check/' + token)
            .then(response => {
                console.log(response.data.id);
                studentNumber = response.data.id;
                validateStudentNumber()
            })
            .catch(error => {
                console.log(error);
                next(error);
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
                next(error);
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

            fs.writeFile("whitelist.json", JSON.stringify(json, null, 2), function (err, result) {
                if (err) {
                    console.log('error', err);
                    next(error);
                }
            });
            res.send("Entry succesfully added to whitelist.");
        });
    }


    req.accepts('application/json');
    if (!req.is('application/json')) {
        // Send error here
        next(error);
    }

    // Part 1: checking if the token and username have a correct length
    if (req.body.username.length !== 0 && req.body.username.length <= 16 && req.body.token.length === 48) {
        username = req.body.username;
        token = req.body.token;
    } else {
        next(error);
    }

    usernameCheck();
});