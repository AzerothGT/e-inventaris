import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PermintaanForm } from '../../../components/permintaan/PermintaanForm'
import { createPermintaan } from '../../../server/functions/permintaan'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageHeader } from '../../../components/ui/PageHeader'


export const Route = createFileRoute('/_authenticated/permintaan/tambah')({
  component: TambahPermintaanPage,
})

function TambahPermintaanPage() {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: createPermintaan,
    onSuccess: () => {
      toast.success('Permintaan barang berhasil dikirim!')
      navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengirim permintaan')
    }
  })

  const handleSubmit = async (data: any) => {
    mutation.mutate({ data })
  }

  return (
    <div className="space-y-6">

      <PageHeader 
        title="Form"
        gradientTitle="Pengadaan Barang"
      />


      
      <div className="flex justify-center stagger-2">

        <PermintaanForm 
          onSubmit={handleSubmit} 
          isLoading={mutation.isPending}
          onCancel={() => navigate({ to: '/dashboard' })}
        />
      </div>
    </div>
  )
}
