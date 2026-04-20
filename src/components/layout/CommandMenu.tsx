import React from 'react'
import { Command } from 'cmdk'
import { Search, Package, MapPin, ArrowRight, LayoutDashboard, ClipboardList, Plus } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { searchEverything } from '../../server/functions/search'

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const [search, setSearch] = React.useState('')
  const router = useRouter()

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', search],
    queryFn: () => searchEverything({ data: { query: search } }),
    enabled: search.length > 0,
    staleTime: 500,
  })

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Search"
      containerClassName="command-menu-overlay"
      className="command-menu-content"
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
          <Search size={18} />
        </div>
        <Command.Input
          placeholder="Cari barang, ruangan, atau aksi..."
          value={search}
          onValueChange={setSearch}
        />
      </div>

      <Command.List>
        <Command.Empty className="py-6 text-center text-sm text-surface-500">
          Tidak ada hasil ditemukan.
        </Command.Empty>

        {/* Search Results: Barang */}
        {results?.barang && results.barang.length > 0 && (
          <Command.Group heading="Barang">
            {results.barang.map((item: any) => (
              <Command.Item
                key={item.id}
                onSelect={() => runCommand(() => router.navigate({ to: '/barang' }))} // In a real app, navigate to detail
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Package size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{item.nama}</span>
                  <span className="text-[11px] text-surface-400">{item.kodeBarang} • {item.kategori}</span>
                </div>
                <div className="command-menu-shortcut">
                  <ArrowRight size={10} />
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {/* Search Results: Ruangan */}
        {results?.ruangan && results.ruangan.length > 0 && (
          <Command.Group heading="Ruangan">
            {results.ruangan.map((room: any) => (
              <Command.Item
                key={room.id}
                onSelect={() => runCommand(() => router.navigate({ to: '/ruangan' }))}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-100 text-surface-600 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{room.nama}</span>
                  <span className="text-[11px] text-surface-400">{room.kodeRuangan} • {room.tipe}</span>
                </div>
                <div className="command-menu-shortcut">
                  <ArrowRight size={10} />
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {/* Actions Group */}
        {!search && (
          <Command.Group heading="Aksi & Navigasi">
            <Command.Item onSelect={() => runCommand(() => router.navigate({ to: '/dashboard' }))}>
              <LayoutDashboard size={16} className="text-surface-400" />
              <span>Dashboard</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.navigate({ to: '/permintaan' }))}>
              <ClipboardList size={16} className="text-surface-400" />
              <span>Daftar Permintaan</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.navigate({ to: '/barang' }))}>
              <Plus size={16} className="text-surface-400" />
              <span>Tambah Barang Baru</span>
            </Command.Item>
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  )
}
