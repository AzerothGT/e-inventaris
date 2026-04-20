import { db } from '../db';
import { barang, ruangan } from '../db/schema';
import { indexBarang, indexRuangan, ensureIndices } from '../server/functions/indexing';

async function reindex() {
  console.log('Starting reindexing...');
  
  try {
    await ensureIndices();
    
    const allBarang = await db.select().from(barang);
    console.log(`Indexing ${allBarang.length} items...`);
    for (const item of allBarang) {
      await indexBarang(item);
    }
    
    const allRuangan = await db.select().from(ruangan);
    console.log(`Indexing ${allRuangan.length} rooms...`);
    for (const room of allRuangan) {
      await indexRuangan(room);
    }
    
    console.log('Reindexing complete!');
  } catch (error) {
    console.error('Reindexing failed:', error);
  }
}

reindex();
