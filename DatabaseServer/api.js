const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const config = require('../config.json');

const app = express();

app.get('/inventoryquantity', function (req, res) {
	const connection = mysql.createConnection({
		host: config.dbServer,
		user: config.dbUser,
		password: config.dbPass,
		database: config.dbSchema,
		port: 3306,
		timeout: 1000,
	});
	if (req.query.itemno && req.query.qty) {
		connection.query(
			`UPDATE inventory SET qty = qty - ${req.query.qty} WHERE itemno = '${req.query.itemno}'`,
			function (error, results, fields) {
				if (error) console.log(error.message);
				else res.send(results);
			}
		);
	} else {
		connection.query('SELECT * FROM inventory', function (
			error,
			results,
			fields
		) {
			if (error) console.log(error.message);
			else res.send(results);
		});
	}
	connection.end();
});

app.get('/noninventoryquantity', function (req, res) {
	const connection = mysql.createConnection({
		host: config.dbServer,
		user: config.dbUser,
		password: config.dbPass,
		database: config.dbSchema,
		port: 3306,
		timeout: 1000,
	});
	if (req.query.itemno && req.query.qty) {
		connection.query(
			`UPDATE noninventory SET qty = qty - ${req.query.qty} WHERE itemno = '${req.query.itemno}'`
		);
	} else {
		connection.query('SELECT * FROM noninventory', function (
			error,
			results,
			fields
		) {
			if (error) console.log(error.message);
			else res.send(results);
		});
	}
	connection.end();
});

app.listen(config.apiPort, () => {
	console.log(`API Set up for database use with details\n==============\nServer: ${config.dbServer},\n
    User: ${config.dbUser},\n
    Pass: ${config.dbPass},\n
    Schema: ${config.dbSchema}`);
});
