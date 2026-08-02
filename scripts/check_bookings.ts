import { Pool } from 'pg';
async function main() {
  const connectionString = "postgres://a19dc792d76362b85b33034b8854690143a2678b4505b8ce11c342546b409ae7:sk_PEWN14UoY4S9cZln8vhkI@db.prisma.io:5432/postgres?sslmode=require";
  const pool = new Pool({ connectionString });
  
  const res = await pool.query(`
    SELECT b.id, b."startDate", b."endDate", p.name as property
    FROM "Booking" b
    JOIN "User" u ON b."customerId" = u.id
    JOIN "Property" p ON b."propertyId" = p.id
    WHERE u.email = 'pedromcm23@gmail.com'
  `);
  console.log("Bookings:", res.rows);
  
  await pool.end();
}
main().catch(console.error);
