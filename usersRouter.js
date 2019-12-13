const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./data/dbConfig.js");
const Users = require("./usersModel.js");

const server = express();

server.use(express.json());

server.post("/register", (req, res) => {
    let user = req.body;
    console.log(user.password, user.password);
    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        console.log(user.password);
        Users.add(user)
            .then(saved => {
                const token = generateToken(saved);
                res.status(201).json({ user: saved, token });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(400).json({
            err: "Please provide username and password."
        });
    }
});

server.post("/login", (req, res) => {
    let { username, password } = req.body;
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);

                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                    token
                });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        });
});

function generateToken(user) {
    const payload = {
        sub: user.id,
        username: user.username,
        department: user.department
    };

    const options = {
        expiresIn: "1d"
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log("Failed verify", err);
                res.status(401).json({ message: "Not verified" });
            } else {
                req.decodedToken = decodedToken;
                next();
            }
        });
    } else {
        res.status(400).json({ message: "No token provided" });
    }
}

server.get("/users", authenticate, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

// server.get("/logout", (req, res) => {
//     req.session.destroy(function(err) {
//         res.status(200).json({ message: "Hope to see you soon again" });
//     });
// });
module.exports = server;
