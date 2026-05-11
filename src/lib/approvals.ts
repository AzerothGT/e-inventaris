export type PermintaanStatus =
  | 'menunggu_kaprog'
  | 'menunggu_wakasek'
  | 'menunggu_kepsek'
  | 'disetujui'
  | 'proses_pembelian'
  | 'selesai'
  | 'ditolak';

export type UserRole =
  | 'admin'
  | 'kaprog'
  | 'penjaga_lab'
  | 'orang_tu'
  | 'wakasek'
  | 'kepala_sekolah'
  | 'tu_admin';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  kaprog: 'Kepala Program',
  penjaga_lab: 'Penjaga Lab',
  orang_tu: 'Staf Tata Usaha',
  wakasek: 'Wakasek',
  kepala_sekolah: 'Kepala Sekolah',
  tu_admin: 'Admin Tata Usaha',
};

export const ROLE_DEPARTMENTS: Record<UserRole, string> = {
  admin: 'Administrator',
  kaprog: 'Kepala Program',
  penjaga_lab: 'Penjaga Lab',
  orang_tu: 'Staf Tata Usaha',
  wakasek: 'Wakasek',
  kepala_sekolah: 'Kepala Sekolah',
  tu_admin: 'Admin Tata Usaha',
};


export interface ApprovalAction {
  id: string;
  label: string;
  from: PermintaanStatus;
  to: PermintaanStatus;
  roles: UserRole[];
  variant: 'default' | 'success' | 'destructive' | 'outline' | 'secondary';
  icon?: string;
  requiresData?: boolean; // For the final "Terima" step
  requiresReason?: boolean; // For rejection/cancellation
}

export const APPROVAL_CONFIG: ApprovalAction[] = [
  // Stage 1: Kaprog Approval
  {
    id: 'approve_kaprog',
    label: 'Setujui (Kaprog)',
    from: 'menunggu_kaprog',
    to: 'menunggu_wakasek',
    roles: ['kaprog', 'admin'],
    variant: 'success',
  },
  {
    id: 'reject_kaprog',
    label: 'Tolak',
    from: 'menunggu_kaprog',
    to: 'ditolak',
    roles: ['kaprog', 'admin'],
    variant: 'destructive',
    requiresReason: true,
  },

  // Stage 2: Wakasek Approval
  {
    id: 'approve_wakasek',
    label: 'Setujui (Wakasek)',
    from: 'menunggu_wakasek',
    to: 'menunggu_kepsek',
    roles: ['wakasek', 'admin'],
    variant: 'success',
  },
  {
    id: 'reject_wakasek',
    label: 'Tolak',
    from: 'menunggu_wakasek',
    to: 'ditolak',
    roles: ['wakasek', 'admin'],
    variant: 'destructive',
    requiresReason: true,
  },

  // Stage 3: Kepsek Approval
  {
    id: 'approve_kepsek',
    label: 'Setujui (Kepsek)',
    from: 'menunggu_kepsek',
    to: 'disetujui',
    roles: ['kepala_sekolah', 'admin'],
    variant: 'success',
  },
  {
    id: 'reject_kepsek',
    label: 'Tolak',
    from: 'menunggu_kepsek',
    to: 'ditolak',
    roles: ['kepala_sekolah', 'admin'],
    variant: 'destructive',
    requiresReason: true,
  },

  // Stage 4: TU Action (Buy)
  {
    id: 'start_purchase',
    label: 'Proses Pembelian',
    from: 'disetujui',
    to: 'proses_pembelian',
    roles: ['tu_admin', 'admin'],
    variant: 'default',
  },

  // Stage 5: TU Action (Receive)
  {
    id: 'complete_purchase',
    label: 'Barang Diterima',
    from: 'proses_pembelian',
    to: 'selesai',
    roles: ['tu_admin', 'admin'],
    variant: 'success',
    requiresData: true,
  },

  // Cancellation (for requester)
  {
    id: 'cancel_request',
    label: 'Batalkan',
    from: 'menunggu_kaprog',
    to: 'ditolak',
    roles: ['penjaga_lab', 'orang_tu', 'tu_admin', 'admin'],
    variant: 'secondary',
    requiresReason: true,
  },
];

export const STATUS_METADATA: Record<PermintaanStatus, { label: string; color: string }> = {
  menunggu_kaprog: { label: 'Menunggu Kaprog', color: 'bg-warning-50 text-warning-600 border-warning-200' },
  menunggu_wakasek: { label: 'Disetujui Kaprog', color: 'bg-success-50 text-success-600 border-success-200' },
  menunggu_kepsek: { label: 'Disetujui Wakasek', color: 'bg-success-50 text-success-600 border-success-200' },
  disetujui: { label: 'Disetujui Kepsek', color: 'bg-success-50 text-success-600 border-success-200' },
  proses_pembelian: { label: 'Proses Pembelian', color: 'bg-primary-50 text-primary-600 border-primary-200' },
  selesai: { label: 'Selesai', color: 'bg-success-500 text-white border-success-600' },
  ditolak: { label: 'Ditolak', color: 'bg-danger-50 text-danger-600 border-danger-200' },
};

export function getAvailableActions(status: PermintaanStatus, role: UserRole): ApprovalAction[] {
  return APPROVAL_CONFIG.filter((action) => action.from === status && action.roles.includes(role));
}

export function isValidTransition(from: PermintaanStatus, to: PermintaanStatus, role: UserRole): boolean {
  return APPROVAL_CONFIG.some(
    (action) => action.from === from && action.to === to && action.roles.includes(role)
  );
}
