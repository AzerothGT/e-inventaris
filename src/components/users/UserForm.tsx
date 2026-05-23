import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { ROLE_DEPARTMENTS } from "../../lib/approvals"

const userSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  name: z.string().min(1, "Nama harus diisi"),
  role: z.enum(['admin', 'kaprog', 'penjaga_lab', 'orang_tu', 'wakasek', 'kepala_sekolah', 'tu_admin']),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  initialData?: Partial<UserFormData>
  onSubmit: SubmitHandler<UserFormData>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isEdit = false,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(
      isEdit 
        ? userSchema.extend({ password: z.string().optional() }) 
        : userSchema
    ),
    defaultValues: initialData || {
      role: "kaprog",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Nama Lengkap</label>
          <Input {...register("name")} placeholder="John Doe" />
          {errors.name && (
            <p className="text-xs text-danger-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Username</label>
          <Input {...register("username")} placeholder="johndoe" />
          {errors.username && (
            <p className="text-xs text-danger-600">{errors.username.message}</p>
          )}
        </div>

        {!isEdit && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700">Password</label>
            <Input type="password" {...register("password")} placeholder="••••••••" autoComplete="new-password" />
            {errors.password && (
              <p className="text-xs text-danger-600">{errors.password.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">Role / Jabatan</label>
          <select
            {...register("role")}
            className="w-full h-10 px-3 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {Object.entries(ROLE_DEPARTMENTS).map(([role, label]) => (
              <option key={role} value={role}>
                {label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-xs text-danger-600">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : isEdit ? "Update Pengguna" : "Tambah Pengguna"}
        </Button>
      </div>
    </form>
  )
}
