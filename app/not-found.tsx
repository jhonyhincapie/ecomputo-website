import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-navy">
      <span className="text-accent-light text-sm font-semibold tracking-widest uppercase mb-4">Error 404</span>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        <span className="text-chrome">Página no encontrada</span>
      </h1>
      <p className="text-gray-400 max-w-md mb-8">
        El equipo o la página que buscas no existe o fue movida. Revisa el catálogo completo o vuelve al inicio.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-electric text-white font-bold px-6 py-3 rounded-lg">
          Volver al inicio
        </Link>
        <Link href="/productos" className="btn-ghost-tech text-white font-bold px-6 py-3 rounded-lg">
          Ver catálogo
        </Link>
      </div>
    </div>
  )
}
