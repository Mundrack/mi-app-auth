# 🏢 Sistema Multi-Tenant

Sistema de gestión multi-organizacional con Next.js 14 y Supabase.

## 🚀 Características

- ✅ Multi-tenant (múltiples organizaciones)
- ✅ 3 roles: Super Admin, Owner, Member
- ✅ Solicitudes de acceso con aprobación
- ✅ Dashboard personalizado por rol
- ✅ Modelo Snowflake Schema optimizado
- ✅ Autenticación con confirmación de email
- ✅ Diseño minimalista responsive

## 📋 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone [tu-repo]
cd mi-app-multi-tenant
```

2. Instala dependencias:
```bash
npm install
```

3. Configura variables de entorno:
- Copia `.env.local` y completa con tus datos de Supabase
- Obtén las keys desde: Supabase Dashboard → Settings → API

4. Ejecuta el proyecto:
```bash
npm run dev
```

5. Abre en tu navegador:
```
http://localhost:3000
```

## 🗄️ Base de Datos

El proyecto usa un modelo **Snowflake Schema** optimizado.

### Ejecutar migraciones SQL:
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta los scripts en orden:
   - PARTE 1: Tablas principales
   - PARTE 2: Índices y triggers
   - PARTE 3: RLS y datos iniciales

## 👥 Roles del Sistema

### Super Admin
- Ve todas las organizaciones
- Gestiona todos los usuarios
- Panel de control global

### Owner (Dueño de Organización)
- Crea su organización
- Aprueba/rechaza solicitudes
- Gestiona empleados
- Ve dashboard de su empresa

### Member (Empleado)
- Solicita unirse a múltiples organizaciones
- Ve sus datos personales
- Ve info de sus empresas

## 📁 Estructura del Proyecto

```
mi-app-multi-tenant/
├── app/              # Pages y layouts
├── components/       # Componentes UI
├── lib/              # Supabase, utils, hooks
└── public/           # Assets estáticos
```

## 🔐 Seguridad

- Row Level Security (RLS) habilitado
- Políticas granulares por rol
- Service Role Key protegida
- Logs de auditoría completos

## 📝 Scripts Disponibles

- `npm run dev` - Modo desarrollo
- `npm run build` - Build producción
- `npm run start` - Iniciar producción
- `npm run lint` - Linter

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecta tu repo con Vercel
2. Agrega variables de entorno
3. Deploy automático

### Otras plataformas
- Compatible con cualquier host de Next.js
- Requiere Node.js 18+

## 📧 Contacto

Para soporte o consultas: [tu-email]

## 📄 Licencia

Proyecto privado - Todos los derechos reservados