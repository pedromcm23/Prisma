import { Pool } from 'pg';
async function main() {
  const connectionString = "postgres://a19dc792d76362b85b33034b8854690143a2678b4505b8ce11c342546b409ae7:sk_PEWN14UoY4S9cZln8vhkI@db.prisma.io:5432/postgres?sslmode=require";
  const pool = new Pool({ connectionString });
  
  await pool.query(`UPDATE "User" SET role = 'HOST' WHERE email IN ('maddyhuth8@gmail.com', 'psousa.apl@gmail.com', 'utongivywei@gmail.com')`);
  console.log("Updated roles to HOST.");
  
  await pool.end();
}
main().catch(console.error);
