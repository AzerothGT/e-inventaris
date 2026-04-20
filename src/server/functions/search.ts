import { createServerFn } from "@tanstack/react-start";
import { getESClient } from "../../lib/elasticsearch";
import { z } from "zod";

export const searchEverything = createServerFn({ method: "GET" })
  .inputValidator(z.object({ query: z.string() }))
  .handler(async ({ data }) => {
    const client = getESClient();
    const { query } = data;

    if (!query) return { barang: [], ruangan: [] };

    try {
      const response = await client.search({
        index: ['barang', 'ruangan'],
        query: {
          multi_match: {
            query,
            fields: [
              'nama^3', 
              'kodeBarang^2', 
              'kodeRuangan^2', 
              'kategori', 
              'merek', 
              'noSeri',
              'tipe'
            ],
            fuzziness: 'AUTO'
          }
        },
        highlight: {
          fields: {
            nama: {},
            kodeBarang: {},
            kodeRuangan: {}
          }
        }
      });

      const hits = response.hits.hits;
      
      const results = {
        barang: hits.filter(h => h._index === 'barang').map(h => ({
          id: h._id,
          ...(h._source as any),
          highlight: h.highlight
        })),
        ruangan: hits.filter(h => h._index === 'ruangan').map(h => ({
          id: h._id,
          ...(h._source as any),
          highlight: h.highlight
        }))
      };

      return results;
    } catch (error) {
      console.error('Search error:', error);
      return { barang: [], ruangan: [] };
    }
  });

export const reindexAll = createServerFn({ method: "POST" })
  .handler(async () => {
    // This function would normally fetch all from DB and index them
    // For now, I'll just leave it as a placeholder to be called from a script or admin UI
    // We already haveensureIndices in indexing.ts
    return { success: true };
  });
