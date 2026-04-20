import { createClient } from '@libsql/client';
const client = createClient({ url: 'file:sqlite.db' });

async function main() {
  const result = await client.execute('SELECT username, role, name FROM users');
  console.log(JSON.stringify(result.rows, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
