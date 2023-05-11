// import pool from '../db'

import pool from "../utilities/db1"

export default function Test({ products }) {
    console.log(products)
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {/* {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))} */}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const { rows } = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';
  `)
  console.log(rows)
//   const products = rows.map((row) => ({
//     id: row.major_id,
//     name: row.major_name,
//   }))

  return {
    props: {
      products: rows,
    },
  }
}
