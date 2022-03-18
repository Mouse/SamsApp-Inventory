const express = require('express');
const sql = require('mysql');
const config = require('./config.json');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3306;

const pool = new sql.createPool({
    connectionLimit: 10,
    host: config.dbServer,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbSchema
});

let log_data = []

if (typeof console != "undefined")
    if (typeof console.log != 'undefined')
        console.olog = console.log;
    else
        console.olog = function() {};

console.log = function(message) {
    console.olog(message);
    log_data.push(`<h3>${new Date().toLocaleString()}</h3><p>${message}</p>`)
};

console.log('Log Setup');

app.use(express.json())

app.get('/log', function(req, res) {
    str = log_data.join('<hr />').replace(/[\n]/g, "<br />")
    res.send(`<h1>Error/Activity Log</h1><hr>${str}`)
});
app.get('/clearlog', function(req, res) {
    log_data = []
    res.redirect('/log');
});

app.get('/inventoryreport', function(req, res) {
    console.log(`Getting inventory report`);

    pool.getConnection((err, connection) => {
        if (err != null) {
            console.log(err);
        } else {
            connection.query('SELECT * FROM inventory', (error, results, fields) => {
                if (error !== null)
                    console.log(error);
                const data = results.map((val) => Object.values(val));
                data.unshift(['Itemno', 'Name', 'Quantity']);
                const retval = data
                    .map((v) => `${v[0]},"${v[1].replace(/\"/g, '\'')}",${v[2]}\r\n`)
                    .join('');
                res.send(retval);
            });
        }
        connection.release();
    });
});

app.get('/noninventoryreport', function(req, res) {
    console.log(`Getting noninventory report`);
    pool.getConnection((err, connection) => {
        if (err != null) {
            console.log(err);
        } else {
            connection.query('SELECT * FROM noninventory', (error, results, fields) => {
                if (error !== null)
                    console.log(error);
                const data = results.map((val) => Object.values(val));
                data.unshift(['Itemno', 'Name', 'Quantity']);
                const retval = data
                    .map((v) => `${v[0]},"${v[1].replace(/\"/g, '\'')}",${v[2]}\r\n`)
                    .join('');
                res.send(retval);
            });
        }
        connection.release();
    });
});

app.get('/checkoutreport', function(req, res) {
    console.log(`Getting checkout report`);
    if (typeof req.query.all !== 'undefined') {
        pool.getConnection((err, connection) => {
            connection.query('SELECT u.id AS member_id, name, orderid, itemno, qty, date_created, notes, type FROM checkouts JOIN fps_users u ON u.id = member_id', (error, results, fields) => {
                if (error !== null)
                    console.log(error);
                let data = results.map((val) => Object.values(val));
                data.unshift(['MemberID', 'Name', 'OrderID', 'ItemNo', 'Quantity', 'DateCreated', 'Notes', 'Type']);
                const retval = data
                    .map((v) => `${v[0]},${v[1]},${v[2]},"${v[3].replace(/\"/g, '\'')}",${v[4]},${v[5]},${v[6]},${v[7]}\r\n`)
                    .join('');

                res.send({
                    checkouts: results,
                    checkout_report_string: retval
                });
                connection.release();
            });
        });
    } else if (typeof req.query.orderid !== 'undefined') {
        pool.getConnection((err, connection) => {
            connection.query(`SELECT u.id AS member_id, name, orderid, itemno, qty, date_created, notes, type FROM checkouts JOIN fps_users u ON u.id = member_id WHERE orderid=${req.query.orderid}`, (error, results, fields) => {
                if (error !== null)
                    console.log(error);
                let data = results.map((val) => Object.values(val));
                data.unshift(['MemberID', 'Name', 'OrderID', 'ItemNo', 'Quantity', 'DateCreated', 'Notes', 'Type']);
                const retval = data
                    .map((v) => `${v[0]},${v[1]},${v[2]},"${v[3].replace(/\"/g, '\'')}",${v[4]},${v[5]},${v[6]},${v[7]}\r\n`)
                    .join('');

                res.send({
                    checkouts: results,
                    checkout_report_string: retval
                });
                connection.release();
            });
        });
    } else {
        pool.getConnection((err, connection) => {
            connection.query(`SELECT u.id AS member_id, name, orderid, date_created, notes, type FROM checkouts JOIN fps_users u ON u.id = member_id GROUP BY orderid`, (error, results, fields) => {
                if (error !== null)
                    console.log(error);
                let data = results.map((val) => Object.values(val));
                data.unshift(['MemberID', 'Name', 'OrderID', 'DateCreated', 'Notes', 'Type']);
                const retval = data
                    .map((v) => `${v[0]},${v[1]},${v[2]},${v[3]},${v[4]},${v[5]}\r\n`)
                    .join('');

                res.send({
                    checkouts: results,
                    checkout_report_string: retval
                });
                connection.release();
            });
        });
    }
});

app.get('/members', function(req, res) {
    pool.getConnection((err, connection) => {
        if (err !== null) {
            console.log(err);
        } else {
            console.log('Grabbing FPS Members');
            connection.query('SELECT * FROM fps_users', (error, results, fields) => {
                res.send(results);
            });
        }
        connection.release();
    });
});

app.get('/inventoryquantity', function(req, res) {
    pool.getConnection((err, connection) => {
        if (err !== null) {
            console.log(err);
        } else {
            console.log(`Grabbing FPS Inventory Quantity`);
            connection.query('SELECT * FROM inventory', (error, results, fields) => {
                if (error !== null)
                    console.log(error);
                res.send(results);
            });
        }
        connection.release();
    });
});

app.get('/noninventoryquantity', function(req, res) {
    pool.getConnection((err, connection) => {
        if (err !== null) {
            console.log(err);
        } else {
            console.log(`Grabbing FPS Non-Inventory Quantity`);
            connection.query('SELECT * FROM noninventory', (error, results, fields) => {
                if (error !== null)
                    console.log(error);

                res.send(results);
            });
        }
        connection.release();
    });
});

app.get('/version', function(req, res) {
    res.send("DB API Version 1.1.4");
});

app.post('/checkoutremove', express.json(), function(req, res) {
    const id = req.body.orderid;
    const itemno = req.body.itemno;

    pool.getConnection((err, connection) => {
        if (err !== null) {
            console.log(err);
        } else {
            console.log(`Removing checkout order with id ${id} and item number ${itemno}`);
            connection.query(`DELETE FROM checkouts WHERE orderid=${id} AND itemno='${itemno}'`,
                (error, results, fields) => { //Test whether deleting a single part of an order removes an entire order or not. It should not.
                });
            if (error !== null)
                console.log(error)
        }
    });
});

app.post('/order', express.json(), function(req, res) {
    const items = req.body.items;
    let inserted = 0;
    let sql_query = "";
    let max_orderid = 1;
    pool.getConnection((err, connection) => {
        if (err !== null) {
            console.log(err);
        } else {
            console.log(`Creating checkout order`);
            connection.query('SELECT MAX(orderid) as MOID FROM checkouts', (error, results, fields) => {
                if (error !== null)
                    console.log(error);
                if (results !== null && results[0].MOID !== null)
                    max_orderid = results[0].MOID + 1;
                let stmt = `INSERT INTO checkouts(orderid,member_id,itemno,qty,type,notes) VALUES ? `;
                let rows = items.map(item => {
                    return [max_orderid, item.member_id, item.itemno, item.cart_qty, item.type === 'INVENTORY' ? 'INVENTORY' : 'NONINVENTORY', item.notes];
                });

                connection.query(stmt, [rows], (error2, results2, fields2) => {
                    if (error2 !== null)
                        console.log(error);
                    rowsComplete = (results2 && results2.affectedRows) || 0;
                    res.send(`${rowsComplete}/${rows.length}`);
                });
            });
        }
        connection.release();
    });
});

app.listen(config.apiPort, () => {
    console.log(`API Set up for database use with details\n==============\nServer: ${config.dbServer},\n
    Schema: ${config.dbSchema}`);
});