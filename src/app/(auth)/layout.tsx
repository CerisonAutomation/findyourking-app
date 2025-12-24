export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary-900 via-slate-900 to-slate-900">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
