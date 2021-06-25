const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const config = require('./config.json');

const app = express();
app.use(bodyParser.json());

const port = 1433;

const pool = new sql.ConnectionPool({
	server: config.dbServer,
	port: port,	
	password: config.dbPass,
	user: config.dbUser,
	database: config.dbSchema,
	driver: "msnodesqlv8",
	options: {
		trustedConnection: true
	}
});

app.get('/inventoryreport', function (req, res) {
	console.log(`Connecting with host: ${config.dbServer}:${port}\n
		User: ${config.dbUser}\n
		Password: ${config.dbPass}\n
		Database: ${config.dbSchema}\n`);

	pool.connect()
		.then(() => {
			return new sql.Request(pool).query('SELECT * FROM inventory');
		})
		.then(results => {
			const data = results.recordset.map((val) => Object.values(val));
			data.unshift(['Itemno', 'Name', 'Quantity']);
			const retval = data
				.map((v) => `${v[0]},"${v[1].replace(/\"/g, '\'')}",${v[2]}\r\n`)
				.join('');
			res.send(retval);
		});
});

app.get('/noninventoryreport', function (req, res) {
	const connection = sql.createConnection({
		host: config.dbServer,
		user: config.dbUser,
		password: config.dbPass,
		database: config.dbSchema,
		port: port
	});

	pool.connect()
		.then(() => {
			return new sql.Request(pool).query('SELECT * FROM noninventory');
		})
		.then(results => {
			const data = results.recordset.map((val) => Object.values(val));
			data.unshift(['Itemno', 'Name', 'Quantity']);
			const retval = data
				.map((v) => `${v[0]},"${v[1].replace(/\"/g, '\'')}",${v[2]}\r\n`)
				.join('');
			res.send(retval);
		});
});

app.get('/checkoutreport', function (req, res) {
	
	console.log(`Connecting with host: ${config.dbServer}:${port}\n
		User: ${config.dbUser}\n
		Password: ${config.dbPass}\n
		Database: ${config.dbSchema}\n\n`);
	
	if (typeof req.query.all !== 'undefined') {
		pool.connect()
		.then(() => {
			return new sql.Request(pool).query('SELECT u.id AS member_id, name, orderid, itemno, qty, date_created, notes, type FROM checkouts JOIN fps_users u ON u.id = member_id')
			})
			.then(results => {
				const data = results.recordset;
				const co_string = data.map((val) => Object.values(val)).map(
					(v) =>
						`${v[0]},${v[1]},${v[2]},"${v[3].replace(/\"/g, '\'')}",${v[4]},${v[5]},${v[6]},${v[7]}\r\n`
				)
					.join('');
				
				res.send({
					checkouts: data,
					checkout_report_string: co_string
				});
			});
	} else if (typeof req.query.orderid !== 'undefined') {
			pool.connect()
			.then(() => {
				return new sql.Request(pool).query(`SELECT u.id AS member_id, name, orderid, itemno, qty, date_created, notes, type FROM checkouts JOIN fps_users u ON u.id = member_id WHERE orderid=${req.query.orderid}`)
			})
			.then(results => {
				const data = results.recordset;
				const co_string = data.map((val) => Object.values(val)).map(
					(v) =>
						`${v[0]},${v[1]},${v[2]},"${v[3].replace(/\"/g, '\'')}",${v[4]},${v[5]},${v[6]},${v[7]}\r\n`
				)
					.join('');
				
				res.send({
					checkouts: data,
					checkout_report_string: co_string
				});
			});
	} else {
			pool.connect()
			.then(() => {
				return new sql.Request(pool).query('SELECT u.id AS member_id, name, orderid, date_created, notes, type FROM checkouts JOIN fps_users u ON u.id = member_id GROUP BY orderid')
			})
			.then (results => {
				const data = results.recordset;
				const co_string = data.map((val) => Object.values(val)).map(
					(v) =>
						`${v[0]},${v[1]},${v[2]},${v[3]},${v[4]},${v[5]}\r\n`
				)
					.join('');
				
				res.send({
					checkouts: data,
					checkout_report_string: co_string
				});
			});
	}
});

app.get('/members', function (req, res) {	
	console.log(`Connecting with host: ${config.dbServer}:${port}\n
		User: ${config.dbUser}\n
		Password: ${config.dbPass}\n
		Database: ${config.dbSchema}\n
		\n`);

		pool.connect()
		.then(() => {
			return new sql.Request(pool).query('SELECT * FROM fps_users');
		})
		.then(results => {
			res.send(results.recordset);
		});
});

app.get('/inventoryquantity', function (req, res) {
	console.log(`Connecting with host: ${config.dbServer}:${port}\n
		User: ${config.dbUser}\n
		Password: ${config.dbPass}\n
		Database: ${config.dbSchema}\n
		\n`);
		
	pool.connect()
		.then(() => {
			return new sql.Request(pool).query('SELECT * FROM inventory');
		})
		.then(results => {
			res.send(results.recordset);
		});
});

app.post('/order', bodyParser.json(), function (req, response) {
	console.log(`Connecting with host: ${config.dbServer}:${port}\n
		User: ${config.dbUser}\n
		Password: ${config.dbPass}\n
		Database: ${config.dbSchema}\n§
		\n`);

	const items = req.body.items;
	let inserted = 0;
	let sql_query = "";
	let max_orderid = 1;
	pool.connect()
		.then(() => {
			return new sql.Request(pool).query('SELECT MAX(orderid) as MOID FROM checkouts');
		})
		.then(results => {
			const res = results.recordset;

			if (res === null || res[0].MOID !== null)
				max_orderid = res[0].MOID+1;

			const table = new sql.Table('checkouts');
			table.columns.add('orderid',sql.Int);
			table.columns.add('member_id',sql.Int);
			table.columns.add('itemno',sql.VarChar(45));
			table.columns.add('qty',sql.Int);
			table.columns.add('type',sql.VarChar(45));
			table.columns.add('notes',sql.Text);

			items.map((item,ind) => {
				table.rows.add(max_orderid,item.member_id,item.itemno,item.cart_qty,item.type === 'INVENTORY' ? 'INVENTORY' : 'NONINVENTORY',item.notes);
			});

			new sql.Request(pool).bulk(table, (err,result) => {
				response.send(`${result.rowsAffected}/${table.rows.length}`);
			});
		});
});

app.get('/noninventoryquantity', function (req, res) {
	pool.connect()
	.then(() => {
		return new sql.Request(pool).query('SELECT * FROM noninventory');
		})
		.then(r => {
		res.send(r.recordset);
		});
});

app.listen(config.apiPort, () => {
	console.log(`API Set up for database use with details\n==============\nServer: ${config.dbServer},\n
    User: ${config.dbUser},\n
    Pass: ${config.dbPass},\n
    Schema: ${config.dbSchema}`);
});
