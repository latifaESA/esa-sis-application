// const mysql = require('mysql2');
const {env} = require('process')
const { Client } = require('pg');
import dotenv from 'dotenv'

dotenv.config('../env')

let connected = false;
async function connect() {
  // Create a new connection to the database

  try {
    const connection = new Client({
      user:env.user,
      host:env.host,
      database:env.database,
      password: env.password,
      port:env.port,
     
    });

    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          // console.error(`Error establishing connection: ${err.message}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log('Connection To DB Established');
    connection.success = true;
    connected = true;
    connection.message = 'Connection To DB Established';
    return connection;
  } catch (err) {
    //console.error(`Error establishing connection: ${err.message}`);
    let result;
    switch (err.code) {
      case 'ECONNREFUSED':
        console.error(`Connection refused`);
        result = 'Connection refused';
        break;
      case 'ENOTFOUND':
        console.error(`Host not found`);
        result = 'Host not found';
        break;
      case 'ENETUNREACH':
        console.error(`No Internet connection`);
        result = 'No Internet connection';
        break;
      case 'ER_ACCESS_DENIED_ERROR':
        console.error(`Access denied, check username and password`);
        result = 'Access denied, check username and password';
        break;
      case '3D000':
        console.error(`Database not found`);
        result = 'Database not found';
        break;
      default:
        console.error(`Uncaught error: ${err.message}`);
        result = err.message;
    }

    return {
      success: false,
      message: `Error establishing connection: ${result}`,
    };
  }
}

async function disconnect(connection) {
  try {
    if (connected) {
      await connection.end();
      console.log('Connection To DB Released');
    } else {
      console.error(`No connection was established to release`);
      return { message: `No connection was established to release` };
    }
  } catch (err) {
    console.error(`Error releasing connection: ${err.message}`);
    return { message: `Error releasing connection: ${err.message}` };
    //=======
    //      console.error(`Error Releasing Connection To DB: ${err.message}`);
    //    }
    //  } catch (err) {
    //    console.error(`Error Releasing Connection To DB: ${err.message}`);
    //
    //>>>>>>> master
  }
}

// executing query
const executeQuery = (connection, query, arraParms) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(query, arraParms, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { executeQuery, connect, disconnect };
