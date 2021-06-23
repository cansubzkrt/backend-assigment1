var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');


var config = {
    host: 'localhost',
    user: 'cansu',
    password: 'root',
    database: 'nodemysqlcrud',
    port: 3306
};

const conn = new mysql.createConnection(config);

conn.connect(
    function(err) {
        if (err) {
            console.log("Bağlantı hatası. Error:");
            throw err;
        } else {
            console.log("Bağlantı sağlandı.");
        }
    });

// Create
router.post('/',
    body('firstName').isAlpha(),
    body('lastName').isAlpha(),
    body('birthday').isDate(),
    body('balance').isNumeric(),
    body('email').isEmail().normalizeEmail(),
    async(req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const birthday = req.body.birthday;
        const balance = req.body.balance;
        const email = req.body.email;

        conn.query("INSERT INTO users (firstName, lastName, birthday, balance, email) VALUES ('" + firstName + "','" + lastName + "','" + birthday + "'," + balance + ",'" + email + "')",
            function(err, results, fields) {
                if (err) throw err;
                else console.log('Inserted ' + results.affectedRows + ' row(s).');
            });

        return res.send(req.body);
    });

// Read
router.get('/', async(req, res) => {
    conn.query("SELECT * FROM users WHERE id=" + req.query.id + ";",
        function(err, results, fields) {
            if (err) {
                return res.status(400).send(err.toString());
            } else {
                if (results.length == 0) {
                    return res.send([]);
                }
                result = Object.values(JSON.parse(JSON.stringify(results)));
            }

            return res.send(result[0]);
        });
});

// List
router.get('/list', async(req, res) => {
    var result = "";
    conn.query("SELECT * FROM users;",
        function(err, results, fields) {
            if (err) {
                return res.status(400).send(err.toString());
            } else {
                result = Object.values(JSON.parse(JSON.stringify(results)));

                if (result.length == 0) {
                    return res.send([])
                }
            }
            return res.send(result);
        });
});

// Update 
router.post('/update',
    body('firstName').isAlpha(),
    body('lastName').isAlpha(),
    body('birthday').isDate(),
    body('email').isEmail().normalizeEmail(),
    body('balance').isNumeric(),
    async(req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        conn.query("UPDATE users SET firstName='" + firstName + "',lastName='" + lastName + "', birthday='" + birthday + "', email='" + email + "',balance=" + balance + " WHERE id=" + req.query.id + ";",
            function(err, results, fields) {
                if (err) {
                    return res.status(400).send(err.toString());
                } else {
                    return res.send({ success: true });
                }
            });
    });

// Delete 
router.delete('/', async(req, res) => {
    conn.query("DELETE FROM users WHERE id=" + req.query.id + ";",
        function(err, results, fields) {
            if (err) {
                return res.status(400).send(err.toString());
            } else {
                return res.send({ success: true });
            }
        });
});

module.exports = router;