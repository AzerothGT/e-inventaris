import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getPermintaanList } from '../../../server/functions/permintaan';
import { PermintaanStatusBadge } from '../../../components/permintaan/PermintaanStatusBadge';
import { PermintaanActionButtons } from '../../../components/permintaan/PermintaanActionButtons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { PermintaanStatus, UserRole } from '../../../lib/approvals';
import { getCurrentUser } from '../../../server/functions/auth';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Dialog } from '../../../components/ui/Dialog';
import { ApprovalLogTable } from '../../../components/permintaan/ApprovalLogTable';
import { useState } from 'react';
import { History } from 'lucide-react';
import { Button } from '../../../components/ui/Button';


export const Route = createFileRoute('/_authenticated/permintaan/')({
  component: PermintaanListPage,
});

function PermintaanListPage() {
  const { data: user } = useQuery({
    queryKey: ['session'],
    queryFn: () => getCurrentUser(),
  });

  const { data: permintaanList, isLoading } = useQuery({
    queryKey: ['permintaan'],
    queryFn: () => getPermintaanList(),
  });

  const [selectedPermintaanId, setSelectedPermintaanId] = useState<string | null>(null);

  const userRole = (user?.role as UserRole) || 'penjaga_lab';

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daftar"
        gradientTitle="Permintaan Barang"
      />

      <Card className="glass-card shadow-xl border-none stagger-2">
        <CardHeader>
          <CardTitle>Semua Permintaan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permintaanList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.namaBarang}</TableCell>
                  <TableCell>{item.jumlah}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      item.prioritas === 'tinggi' ? 'text-red-500' : 
                      item.prioritas === 'sedang' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {item.prioritas}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PermintaanStatusBadge status={item.status as PermintaanStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Riwayat"
                        onClick={() => setSelectedPermintaanId(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <History className="h-4 w-4 text-surface-500 hover:text-primary-600 transition-colors" />
                      </Button>
                      
                      <PermintaanActionButtons 
                        permintaanId={item.id} 
                        currentStatus={item.status as PermintaanStatus} 
                        userRole={userRole}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {permintaanList?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-surface-400">
                    Belum ada permintaan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        isOpen={selectedPermintaanId !== null}
        onClose={() => setSelectedPermintaanId(null)}
        title="Riwayat Persetujuan"
        size="lg"
      >
        <div className="py-2">
          {selectedPermintaanId && <ApprovalLogTable permintaanId={selectedPermintaanId} />}
        </div>
      </Dialog>
    </div>
  );
}
