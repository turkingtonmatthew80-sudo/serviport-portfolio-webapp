import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function test() {
  try {
    const res = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log("Connected successfully!");
    console.log("Tables:");
    res.rows.forEach(r => console.log(r.table_name));
    process.exit(0);
  } catch(e) {
    console.error("Connection failed");
    console.error(e.message);
    process.exit(1);
  }
}
test();
