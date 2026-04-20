import { createClient } from '@libsql/client';
const client = createClient({ url: 'file:sqlite.db' });

async function main() {
  console.log('Migrating roles...');
  
  // Update kepala_program to kaprog
  const res1 = await client.execute({
    sql: "UPDATE users SET role = 'kaprog' WHERE role = 'kepala_program'",
    args: []
  });
  console.log(`Updated kepala_program: ${res1.rowsAffected} users`);

  // Update tata_usaha to tu_admin
  const res2 = await client.execute({
    sql: "UPDATE users SET role = 'tu_admin' WHERE role = 'tata_usaha'",
    args: []
  });
  console.log(`Updated tata_usaha: ${res2.rowsAffected} users`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
