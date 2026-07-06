# ECOMPUTO — Sistema Web

Sitio web profesional para **Comercializadora ECOMPUTO** (Medellín, Colombia).

Incluye: catálogo de productos, sistema de cotización por email y WhatsApp, panel de administración y bot automático de WhatsApp.

---

## Instalación en 5 pasos

### Paso 1 — Clonar el proyecto
```bash
git clone [URL_DEL_REPOSITORIO]
cd ecomputo/website
```

### Paso 2 — Instalar dependencias
```bash
npm install
```

### Paso 3 — Configurar variables de entorno
```bash
cp .env.example .env.local
```
Editar `.env.local` y rellenar los siguientes valores:

| Variable | Dónde obtenerla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dashboard Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard Supabase → Settings → API (secret) |
| `ADMIN_EMAIL` | El email que usarás para entrar al panel |
| `ADMIN_PASSWORD` | La contraseña del panel admin |
| `NEXTAUTH_SECRET` | Generarlo con: `openssl rand -base64 32` |
| `RESEND_API_KEY` | Crear cuenta en [resend.com](https://resend.com) |
| `WHATSAPP_NUMBER` | Número del cliente (formato: `573001234567`) |

### Paso 4 — Instalar y conectar el bot de WhatsApp
```bash
# Desde la raíz del proyecto (carpeta ECOMPUTO)
cd ../whatsapp-agent
npm install
npm run start:dev
```
- Escanear el **código QR** con el celular del cliente (WhatsApp → Dispositivos vinculados)
- El bot quedará activo en el puerto `2785`
- Configurar el webhook en el dashboard de OpenWA (`http://localhost:2785`) apuntando a: `http://localhost:3000/api/whatsapp/webhook`

### Paso 5 — Iniciar el sitio
```bash
# Volver a la carpeta website
cd ../website

# Desarrollo (pruebas)
npm run dev

# O hacer deploy en Vercel para producción
```

---

## URLs del sistema

| URL | Descripción |
|---|---|
| `http://localhost:3000` | Sitio web público |
| `http://localhost:3000/admin` | Panel de administración |
| `http://localhost:2785` | Dashboard OpenWA (WhatsApp) |
| `https://supabase.com/dashboard` | Base de datos |

---

## Deploy en Vercel (producción)

1. Subir el código a GitHub
2. Ir a [vercel.com](https://vercel.com) → **Import Project** → seleccionar el repositorio
3. En **Environment Variables**, agregar todas las variables de `.env.local`
4. Click **Deploy** — el sitio queda online en minutos
5. Cada `git push` hace re-deploy automático

---

## Al instalar en un PC diferente

Solo cambia esto en `.env.local`:

- `WHATSAPP_NUMBER` → el número del cliente final
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` → credenciales del panel del cliente
- `NEXTAUTH_SECRET` → generar uno nuevo
- `ADMIN_EMAIL` / `EMAIL_TO` en Configuración → email del cliente

La base de datos (Supabase) y los productos ya cargados viajan con el proyecto — solo comparte las credenciales.

El bot de WhatsApp necesita re-escanear el QR con el celular del cliente (nuevo número = nueva sesión).

---

## Estructura del proyecto

```
website/
├── app/                    # Páginas Next.js (App Router)
│   ├── page.tsx           # Homepage
│   ├── productos/         # Catálogo completo
│   ├── categoria/[slug]/  # Por categoría
│   ├── producto/[slug]/   # Detalle del producto
│   ├── admin/             # Panel de administración
│   └── api/               # API routes
├── components/
│   ├── layout/            # Navbar, Footer, WhatsApp FAB
│   ├── home/              # Secciones de la homepage
│   ├── products/          # Cards, filtros, modal de cotización
│   └── admin/             # Sidebar, formularios admin
├── lib/
│   ├── supabase.ts        # Cliente de base de datos
│   ├── auth.ts            # Configuración NextAuth
│   ├── resend.ts          # Envío de emails
│   └── whatsapp.ts        # Cliente OpenWA
└── types/index.ts         # Tipos TypeScript compartidos
```

---

## Soporte

Desarrollado por **Jhony Hincapie** para Comercializadora ECOMPUTO.
