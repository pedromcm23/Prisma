require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(
      'UPDATE "User" SET role = $1 WHERE email = $2 RETURNING email, role',
      ['CUSTOMER', 'pedromcm23@gmail.com']
    );
    console.log("Updated User:", res.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
main();
