import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  const sqlFile = join(process.cwd(), 'drizzle', '0000_familiar_mandroid.sql');
  const content = readFileSync(sqlFile, 'utf8');
  
  // Split by statement-breakpoint
  const statements = content.split('--> statement-breakpoint');
  
  console.log(`Found ${statements.length} statements. Executing...`);
  
  for (const statement of statements) {
    if (!statement.trim()) continue;
    try {
      await db.run(sql.raw(statement));
      console.log('Executed statement successfully.');
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        console.log('Table/Index already exists, skipping...');
      } else {
        console.error('Error executing statement:', err.message);
      }
    }
  }
  
  console.log('Migration finished.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
