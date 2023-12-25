// // const mysql = require('mysql2');
// // const { env } = require('process');
// const { Client } = require("pg");
// import dotenv from "dotenv";

// dotenv.config("../env");

// let connected = false;
// async function connect() {
//   // Create a new connection to the database
//   try {
//     const connection = new Client({
//       user: process.env.user,
//       host: process.env.host,
//       database: process.env.database,
//       password: process.env.password,
//       port: process.env.PORTS,
//     });
//     await new Promise((resolve, reject) => {
//       connection.connect((err) => {
//         if (err) {
//           // console.error(`Error establishing connection: ${err.message}`);
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//     // console.log("Connection To DB Established");
//     connection.success = true;
//     connected = true;
//     connection.message = "Connection To DB Established";
//     return connection;
//   } catch (err) {
//     //console.error(`Error establishing connection: ${err.message}`);
//     let result;
//     switch (err.code) {
//       case "ECONNREFUSED":
//         console.error(`Connection refused`);
//         result = "Connection refused";
//         break;
//       case "ENOTFOUND":
//         console.error(`Host not found`);
//         result = "Host not found";
//         break;
//       case "ENETUNREACH":
//         console.error(`No Internet connection`);
//         result = "No Internet connection";
//         break;
//       case "ER_ACCESS_DENIED_ERROR":
//         console.error(`Access denied, check username and password`);
//         result = "Access denied, check username and password";
//         break;
//       case "3D000":
//         console.error(`Database not found`);
//         result = "Database not found";
//         break;
//       default:
//         console.error(`Uncaught error: ${err.message}`);
//         result = err.message;
//     }

//     return {
//       success: false,
//       message: `Error establishing connection: ${result}`,
//     };
//   }
// }

// async function disconnect(connection) {
//   try {
//     if (connected) {
//       await connection.end();
//       // console.log("Connection To DB Released");
//     } else {
//       console.error(`No connection was established to release`);
//       return { message: `No connection was established to release` };
//     }
//   } catch (err) {
//     console.error(`Error releasing connection: ${err.message}`);
//     return { message: `Error releasing connection: ${err.message}` };
//   }
// }

// // executing query
// const executeQuery = (connection, query, arraParms) => {
//   return new Promise((resolve, reject) => {
//     try {
//       connection.query(query, arraParms, (err, data) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(data);
//         }
//       });
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

// module.exports = { executeQuery, connect, disconnect };

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Assuming the .env file is in the root of your project

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.PORTS,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Error with database pool', err);
  process.exit(-1); // Exit the process on a database error
});

async function connect() {
  try {
    const client = await pool.connect();
    console.log('Connection to database pool established');
    return client;
  } catch (err) {
    console.error(`Error establishing connection: ${err.message}`);
    return {
      success: false,
      message: `Error establishing connection: ${err.message}`,
    };
  }
}

async function disconnect(client) {
  try {
    await client.release();
    console.log('Connection to database pool released');
  } catch (err) {
    console.error(`Error releasing connection: ${err.message}`);
    return { message: `Error releasing connection: ${err.message}` };
  }
}

// executing query
const executeQuery = (client, query, arraParms) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await client.query(query, arraParms);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

export { executeQuery, connect, disconnect };
