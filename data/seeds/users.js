const bcrypt = require("bcryptjs");

 exports.seed = function(knex, Promise) {
  return knex("users").truncate()
  .then(function() {
     return knex('users').insert(
[
    { username: "HarryPotter", password: bcrypt.hashSync("password", 10), department: "PR" },
    { username: "JustHarry", password: bcrypt.hashSync("password2", 10), department: "HR" },
    { username: "JustPotter", password: bcrypt.hashSync("password3", 10), department: "HR" }
  ]);
  })
};

