import { getESClient } from '../../lib/elasticsearch';

const ITEM_INDEX = 'barang';
const ROOM_INDEX = 'ruangan';

export async function ensureIndices() {
  const client = getESClient();
  
  const indices = [ITEM_INDEX, ROOM_INDEX];
  
  for (const index of indices) {
    const exists = await client.indices.exists({ index });
    if (!exists) {
      await client.indices.create({
        index,
        settings: {
          analysis: {
            analyzer: {
              default: {
                type: 'standard',
              },
            },
          },
        },
      });
      console.log(`Created index: ${index}`);
    }
  }
}

export async function indexBarang(data: any) {
  const client = getESClient();
  try {
    await client.index({
      index: ITEM_INDEX,
      id: data.id,
      document: {
        id: data.id,
        kodeBarang: data.kodeBarang,
        nama: data.nama,
        kategori: data.kategori,
        merek: data.merek,
        noSeri: data.noSeri,
        status: data.status,
        jumlah: data.jumlah,
        ruanganId: data.ruanganId,
        suggest: {
          input: [data.nama, data.kodeBarang, data.merek],
          weight: 10
        }
      },
      refresh: true // For dev, we refresh immediately
    });
  } catch (error) {
    console.error('Error indexing barang:', error);
  }
}

export async function indexRuangan(data: any) {
  const client = getESClient();
  try {
    await client.index({
      index: ROOM_INDEX,
      id: data.id,
      document: {
        id: data.id,
        kodeRuangan: data.kodeRuangan,
        nama: data.nama,
        tipe: data.tipe,
        suggest: {
          input: [data.nama, data.kodeRuangan],
          weight: 10
        }
      },
      refresh: true
    });
  } catch (error) {
    console.error('Error indexing ruangan:', error);
  }
}

export async function deleteFromIndex(index: string, id: string) {
  const client = getESClient();
  try {
    await client.delete({
      index,
      id,
      refresh: true
    });
  } catch (error) {
    // Ignore 404
    if ((error as any).meta?.statusCode !== 404) {
      console.error(`Error deleting from ${index}:`, error);
    }
  }
}
