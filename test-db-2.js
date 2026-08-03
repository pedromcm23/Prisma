const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL });

async function main() {
  const res = await pool.query("SELECT id, email, role FROM \"User\" WHERE email LIKE '%pedromcm%'");
  console.log("Users:", res.rows);
  if (res.rows.length > 0) {
    const props = await pool.query("SELECT id, name FROM \"Property\" WHERE \"hostId\" = $1", [res.rows[0].id]);
    console.log("Properties for first user:", props.rows);
  }
}

main().catch(console.error).finally(() => pool.end());
