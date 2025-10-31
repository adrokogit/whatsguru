# 🤖 WhatsApp Bot (Node.js + TypeScript)

Bot modular para WhatsApp construido con **whatsapp-web.js**, escrito en **TypeScript (modo no estricto)**, y diseñado para ser fácilmente extensible mediante _handlers_, _wrappers_ y un sistema de **tareas programadas** con API REST.

---

## 🚀 Características principales

- ✅ Desarrollado en **Node.js + TypeScript**
- 🧩 Arquitectura basada en **handlers** (clases independientes por comando)
- 🧱 Soporte para **wrappers**:
  - `PrivateWrapperHandler` → restringe un handler a un número concreto
  - `GroupWrapperHandler` → restringe un handler a un grupo concreto
- ⏰ **Scheduler** con `node-cron` y `setTimeout` para programar mensajes automáticos
- 🌐 **API REST** con CRUD completo para gestionar mensajes programados
- 🔑 **Protección con API key** (`x-api-key` o `?api_key=...`)
- 🧾 **Logs** con `morgan` (HTTP) y logger propio (negocio)
- 🌊 Integración opcional con **Stormglass API** para datos de olas, viento y mareas
- 💬 Sistema de **ayuda automática** con el comando `!!help`
- 🔐 Autenticación local (`LocalAuth`) para conservar la sesión de WhatsApp
- ⚙️ Configuración mediante archivo **.env**

---

## 🏗️ Estructura del proyecto

```
src/
  app.ts                     # Punto de entrada principal (bot)
  server.ts                  # Servidor Express con API REST
  api/
    schedulerApi.ts          # CRUD de mensajes programados
  scheduler/
    scheduler.ts             # Lógica de programación (node-cron)
  whatsapp/
    client.ts                # Inicializa el cliente de WhatsApp
  core/
    MessageContext.ts
    MessageHandler.ts
    HandlerRegistry.ts
  handlers/
    PingHandler.ts
    EchoHandler.ts
    GroupIdHandler.ts
    HelpHandler.ts
    ReminderHandler.ts
    PrivateWrapperHandler.ts
    GroupWrapperHandler.ts
    WhatsGuruHandler.ts
  middleware/
    apiKey.ts                # Middleware de autenticación con API key
  utils/
    logger.ts                # Logger centralizado
.env                         # Variables de entorno (API keys)
```

---

## ⚙️ Instalación

```bash
git clone <url-del-repo>
cd whatsapp-bot
npm install

echo "STORMGLASS_API_KEY=tu_api_key" >> .env
echo "API_KEY=supersecreto123" >> .env

npm run dev
```

---

## 🌊 Configuración del entorno (.env)

```
STORMGLASS_API_KEY=tu_api_key_de_stormglass
API_KEY=supersecreto123
PORT=3000
```

---

## 🧠 Logs

- `morgan` → peticiones HTTP
- `logger.ts` → eventos del bot y scheduler

Ejemplo:

```
[2025-10-31T10:00:00Z] [INFO] Mensaje enviado { id: "abc123xy", to: "34600111222@c.us" }
GET /api/schedules 200 12ms
```

---

## 🌐 API REST de mensajes programados

| Método | Ruta               | Descripción  |
| ------ | ------------------ | ------------ |
| GET    | /api/schedules     | Lista todos  |
| GET    | /api/schedules/:id | Devuelve uno |
| POST   | /api/schedules     | Crea nuevo   |
| PUT    | /api/schedules/:id | Actualiza    |
| DELETE | /api/schedules/:id | Elimina      |

### Autenticación

```bash
-H 'x-api-key: supersecreto123'
# o
?api_key=supersecreto123
```

### Ejemplo con curl

```bash
curl -X POST http://localhost:3000/api/schedules   -H 'Content-Type: application/json'   -H 'x-api-key: supersecreto123'   -d '{
    "to": "34600111222@c.us",
    "text": "Mensaje automático ⏱️",
    "type": "cron",
    "cronExpr": "*/10 * * * * *"
  }'
```

---

## 🧩 Handlers disponibles

| Handler               | Descripción     |
| --------------------- | --------------- |
| PingHandler           | Responde a ping |
| EchoHandler           | Repite texto    |
| HelpHandler           | Lista comandos  |
| GroupIdHandler        | ID del grupo    |
| ReminderHandler       | Recordatorios   |
| WhatsGuruHandler      | Parte marítimo  |
| PrivateWrapperHandler | Limita usuario  |
| GroupWrapperHandler   | Limita grupo    |

---

## 📜 Licencia

MIT — libre para usar y modificar.

---

## 🧑‍💻 Autor

Desarrollado por **Adrokogit**  
Arquitectura basada en handlers, wrappers, scheduler, API REST y conexión a APIs externas como Stormglass.
