var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE
});

// var pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: '5han7anu',
//     password: 'pencil--14',
//     database: 'AngularBlog'
// });

exports.pool = pool;

// Use this function to call a procedure that doesn't return anything
exports.empty = function(procName, args) {
    return callProcedure(procName, args)
        .then( function() {} ); // throwing away the resultset
}

// Use this function to call a procedure when expecting a single item back
exports.row = function(procName, args) {
    return callProcedure(procName, args)
            .then(function(resultsets) {
                return resultsets[0][0];
            });
}

// Use this function to call a procedure when expecting multiple rows back
exports.rows = function (procName, args) {
    return callProcedure(procName, args)
            .then(function(resultsets) {
                return resultsets[0];
            });
}

// Do not call this directly
function callProcedure(procName, args) {
    if (!args) {
        args = [];
    }
    var argString = '';
    for (var i = 0; i < args.length; i++) {
        if (i === args.length - 1) { // we're on the last argument
            argString += '?';
        } else {
            argString += '?,';
        }
    }
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL ' + procName + '(' + argString + ');', args, function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                });
            }
        });
    });
}