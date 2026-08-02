import { Pool } from 'pg';
async function main() {
  const connectionString = "postgres://a19dc792d76362b85b33034b8854690143a2678b4505b8ce11c342546b409ae7:sk_PEWN14UoY4S9cZln8vhkI@db.prisma.io:5432/postgres?sslmode=require";
  const pool = new Pool({ connectionString });
  
  const users = await pool.query('SELECT id, name, email, role FROM "User"');
  console.log("Users:", users.rows);

  const props = await pool.query('SELECT id, name, "hostId" FROM "Property"');
  console.log("Properties:", props.rows);
  
  await pool.end();
}
main().catch(console.error);
