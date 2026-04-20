import { createClient } from '@libsql/client';
const client = createClient({ url: 'file:sqlite.db' });

async function main() {
  console.log('Fetching first permintaan...');
  const requests = await client.execute('SELECT id, status FROM permintaan_pengadaan LIMIT 1');
  
  if (requests.rows.length === 0) {
    console.log('No permintaan found.');
    process.exit(0);
  }

  const item = requests.rows[0];
  console.log(`Found: ID=${item.id}, Status=${item.status}`);

  console.log('Attempting update to menunggu_wakasek...');
  const res = await client.execute({
    sql: "UPDATE permintaan_pengadaan SET status = 'menunggu_wakasek' WHERE id = ?",
    args: [item.id]
  });

  console.log(`Update Result: ${res.rowsAffected} rows affected`);
  
  const verify = await client.execute({
    sql: "SELECT status FROM permintaan_pengadaan WHERE id = ?",
    args: [item.id]
  });
  console.log(`New Status in DB: ${verify.rows[0].status}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
