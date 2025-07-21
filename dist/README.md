# 🚀 Social Media Kit Híbrido - Samantha Crianza

Kit de medios sociales profesional con sistema híbrido de datos para **@samanthacrianza**, asesora en crianza respetuosa.

## ✨ Características Principales

### 🎯 Sistema Híbrido Inteligente
- **Web scraping ético** de Instagram y TikTok con rate limiting
- **Datos manuales curados** para máxima precisión
- **Fallback automático** cuando el scraping falla
- **Cache inteligente** para optimizar rendimiento

### 📊 Dashboard Profesional
- **Métricas en tiempo real**: Followers, engagement, alcance, views
- **Visualizaciones interactivas** con Chart.js
- **Top content** del mes con análisis de rendimiento
- **Analytics detallados**: demografía, hashtags, horarios óptimos

### 🎨 Diseño Moderno
- **Glassmorphism** y efectos visuales avanzados
- **Animaciones suaves** y micro-interacciones
- **Responsive design** optimizado para móvil
- **Paleta de colores** específica para el nicho de crianza

### 🔧 Funcionalidades Técnicas
- **Rate limiting ético** (2-3 segundos entre requests)
- **Manejo robusto de errores** con recuperación automática
- **Exportación de datos** en JSON/PDF
- **Auto-actualización** cada hora
- **Sistema de notificaciones** inteligente

## 🚀 Instalación Rápida

### Prerrequisitos
- Navegador web moderno
- Conexión a internet para CDN dependencies
- (Opcional) Python para servidor local

### Pasos de Instalación

1. **Clonar o descargar** el proyecto:
```bash
git clone [URL_DEL_REPOSITORIO]
cd social-media-kit
```

2. **Instalar dependencias** (opcional para desarrollo):
```bash
npm install
```

3. **Iniciar servidor local**:
```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: NPM (si instalaste dependencias)
npm run dev

# Opción 3: Live Server (VS Code extension)
# Click derecho en index.html > "Open with Live Server"
```

4. **Abrir en navegador**:
```
http://localhost:8000
```

### 📱 Despliegue en Netlify (Recomendado)

1. **Conectar repositorio** a Netlify
2. **Configurar build**: 
   - Build command: `npm run build`
   - Publish directory: `.`
3. **Deploy** automáticamente

### 🌐 Despliegue en Vercel

1. **Importar proyecto** en Vercel
2. **Configurar framework**: Static
3. **Deploy** con un click

## 📖 Guía de Uso

### Actualización de Datos

#### 🔄 Actualización Automática
El sistema se actualiza automáticamente cada hora obteniendo:
- Followers actuales de Instagram y TikTok
- Métricas de engagement públicas
- Verificación de perfiles

#### ✏️ Actualización Manual
Para actualizar datos específicos:

1. **Editar** `assets/data/manual-data.json`
2. **Recargar** la página o click en "Actualizar"

#### 🎯 Datos Clave para Actualizar
```json
{
  "instagram": {
    "followers": 46200,
    "engagementRate": 7.8,
    "topPosts": [...]
  },
  "tiktok": {
    "followers": 78400,
    "averageViews": 45200,
    "topVideos": [...]
  }
}
```

### Personalización

#### 🎨 Cambiar Colores
Editar variables CSS en `assets/css/main.css`:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
    --accent-color: #45b7d1;
}
```

#### 📊 Configurar Scraping
Modificar `assets/data/cache-config.json`:
```json
{
  "rateLimiting": {
    "instagram": { "requestDelay": 2000 },
    "tiktok": { "requestDelay": 3000 }
  }
}
```

## 🛡️ Consideraciones Éticas y Legales

### ✅ Prácticas Éticas Implementadas
- **Rate limiting estricto** (2-3 segundos entre requests)
- **Respeto a robots.txt** de las plataformas
- **Solo datos públicos** - no accede a información privada
- **User-Agent identificado** correctamente
- **Fallback a datos manuales** cuando sea necesario

### 📋 Cumplimiento Legal
- **GDPR**: Solo procesa datos públicos
- **Terms of Service**: Respeta límites de las plataformas
- **Fair Use**: Uso educativo y promocional

### ⚠️ Limitaciones del Scraping
- Instagram y TikTok pueden bloquear requests masivos
- Los datos scraped son aproximados
- Se recomienda actualización manual mensual
- El sistema prioriza datos manuales sobre scraped

## 📂 Estructura del Proyecto

```
social-media-kit/
├── 📄 index.html              # Dashboard principal
├── 📁 assets/
│   ├── 🎨 css/
│   │   ├── main.css           # Estilos base y variables
│   │   └── dashboard.css      # Estilos específicos
│   ├── 💻 js/
│   │   ├── scraping-engine.js # Motor de scraping ético
│   │   ├── data-manager.js    # Gestión híbrida de datos
│   │   ├── dashboard.js       # Lógica de interfaz
│   │   └── analytics.js       # Calculadora de métricas
│   └── 📊 data/
│       ├── manual-data.json   # Datos curados manualmente
│       └── cache-config.json  # Configuración de cache
├── 🔧 utils/
│   ├── rate-limiter.js        # Limitador de velocidad
│   ├── cors-proxy.js          # Manejo de CORS
│   └── error-handler.js       # Manejo de errores
├── 📚 docs/                   # Documentación detallada
├── ⚙️ config/                 # Archivos de configuración
├── 📦 package.json            # Dependencias del proyecto
├── 🌐 netlify.toml           # Configuración de despliegue
└── 📖 README.md               # Esta documentación
```

## 🔧 API y Configuración

### Endpoints de Scraping
```javascript
// Instagram (ejemplo)
https://www.instagram.com/samanthacrianza/

// TikTok (ejemplo)
https://www.tiktok.com/@samanthacrianza
```

### Variables de Entorno
```javascript
// Configuración en cache-config.json
{
  "corsProxy": "https://api.allorigins.win/get?url=",
  "userAgent": "Mozilla/5.0...",
  "respectRobotsTxt": true,
  "fallbackToManual": true
}
```

## 🎯 Métricas Calculadas

### 📊 Métricas Principales
- **Total Followers**: Instagram + TikTok
- **Engagement Rate**: Promedio ponderado por plataforma
- **Monthly Reach**: Followers × Engagement × Posts/mes × Multiplier
- **Average Views**: Promedio entre plataformas

### 🏆 Puntuación de Influencer
```javascript
score = (followerScore + engagementScore + consistencyScore) × nicheMultiplier
```

### 💰 Estimación de Ingresos
- **Tier-based**: Diferentes rates por nivel de followers
- **Engagement multiplier**: Ajuste basado en engagement
- **Niche multiplier**: 1.2x para crianza/educación infantil

## 🐛 Troubleshooting

### Problemas Comunes

#### ❌ No se cargan los datos
1. **Verificar conexión** a internet
2. **Revisar consola** para errores JavaScript
3. **Comprobar** que manual-data.json es válido
4. **Recargar** la página

#### 🔄 Scraping no funciona
1. **Normal**: El sistema usa fallback a datos manuales
2. **Verificar** rate limiting en configuración
3. **Revisar** si las plataformas bloquearon requests
4. **Actualizar manualmente** los datos

#### 📱 Problemas de diseño móvil
1. **Limpiar caché** del navegador
2. **Verificar** que CSS se carga correctamente
3. **Probar** en modo incógnito

### 🆘 Soporte
- **Issues**: Reportar problemas en GitHub Issues
- **Documentación**: Ver carpeta `docs/` para detalles
- **Logs**: Revisar consola del navegador

## 🚀 Roadmap Futuro

### v2.0 (Próximamente)
- [ ] **Dashboard admin** para editar datos
- [ ] **Métricas avanzadas** con IA
- [ ] **Comparación competitiva**
- [ ] **Reportes automatizados** por email

### v2.1 (Futuro)
- [ ] **Integración YouTube**
- [ ] **Análisis de sentimientos**
- [ ] **Predicciones de crecimiento**
- [ ] **API pública**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. **Fork** el proyecto
2. **Crear** una branch feature
3. **Commit** cambios
4. **Push** a la branch
5. **Abrir** un Pull Request

## 👥 Créditos

- **Desarrollo**: Claude Code
- **Diseño**: Inspirado en tendencias 2024
- **Datos**: @samanthacrianza
- **Charts**: Chart.js
- **Icons**: Unicode Emoji

---

**Made with 💝 for the parenting community**

*© 2024 Samantha - Crianza Respetuosa. All rights reserved.*