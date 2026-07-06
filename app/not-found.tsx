import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-navy">
      <span className="text-accent-light text-sm font-semibold tracking-widest uppercase mb-4">Error 404</span>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Página no encontrada</h1>
      <p className="text-gray-400 max-w-md mb-8">
        El equipo o la página que buscas no existe o fue movida. Revisa el catálogo completo o vuelve al inicio.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-lg transition-colors">
          Volver al inicio
        </Link>
        <Link href="/productos" className="border border-border-subtle hover:border-accent text-white font-bold px-6 py-3 rounded-lg transition-colors">
          Ver catálogo
        </Link>
      </div>
    </div>
  )
}
