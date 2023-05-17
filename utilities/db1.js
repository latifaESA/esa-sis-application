// // import { Pool } from 'pg'

// import { Client } from "pg";

// // import { Client } from "pg"
// const { Client } = require('pg');

// const pool = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: '0000',
//   port: 5432,
// })
// let ne = pool.connect();
// console.log(ne)
// // export default pool

const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'esa-sis-aplication',
  password: 'root',
  port: 5432,
});

// const client = new Client({
//   user: env.user,
//   host: env.host,
//   database: env.database,
//   password: env.password,
//   port: env.port,
// });

client.connect();

// client.query("Select * from major", (err, res) => {
//   if(!err){
//     console.log(res.rows);
//   }else{
//     console.log(res.message)
//   }
//   client.end;
// })

// export default client;

module.exports = {
  default: client,
};
