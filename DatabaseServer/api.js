const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const config = require('../config.json');

const connection = mysql.createPool({
    host: config.dbServer,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbSchema,
    port: 3306
});

const app = express();

app.get('/inventoryquantity', function (req,res) {
    connection.getConnection(function (err,conn) {
        connection.query('SELECT * FROM inventory', function(error,results,fields) {
            if (error) throw error;
            res.send(results);
        });
    });
});

app.get('/noninventoryquantity', function (req,res) {
    connection.getConnection(function (err,conn) {
        connection.query('SELECT * FROM noninventory', function(error,results,fields) {
            if (error) throw error;
            res.send(results);
        });
    });
});

app.listen(3000, () => {
    console.log(`API Set up for database use with details\n==============\nServer: ${config.dbServer},\n
    User: ${config.dbUser},\n
    Pass: ${config.dbPass},\n
    Schema: ${config.dbSchema}`);
});