# 🤖 WhatsApp Bot (Node.js + TypeScript)

Bot modular para WhatsApp construido con **whatsapp-web.js**, escrito en **TypeScript (modo no estricto)**, y diseñado para ser fácilmente extensible mediante _handlers_ y _wrappers_.

---

## 🚀 Características principales

- ✅ Desarrollado en **Node.js + TypeScript**
- 🧩 Arquitectura basada en **handlers** (clases independientes por comando)
- 🧱 Soporte para **wrappers**:
  - `PrivateWrapperHandler` → restringe un handler a un número concreto
  - `GroupWrapperHandler` → restringe un handler a un grupo concreto
- ⏰ **Scheduler** con `node-cron` y `setTimeout` para programar mensajes
- 🌊 Integración con **Stormglass API** para datos de olas, viento y mareas
- 💬 Sistema de **ayuda automática** con el comando `!!help`
- 🔐 Autenticación local (`LocalAuth`) para conservar la sesión de WhatsApp
- 🔑 Configuración mediante archivo **.env**

---

## 🏗️ Estructura del proyecto

```
src/
  app.ts                     # Punto de entrada principal
  whatsapp/
    client.ts                # Inicializa el cliente de WhatsApp
  core/
    MessageContext.ts        # Contexto común para cada mensaje
    MessageHandler.ts        # Interfaz base de handlers
    HandlerRegistry.ts       # Registro y procesamiento de handlers
  handlers/
    PingHandler.ts
    EchoHandler.ts
    GroupIdHandler.ts
    HelpHandler.ts
    PrivateWrapperHandler.ts
    GroupWrapperHandler.ts
    WhatsGuruHandler.ts      # Nuevo handler: parte marítimo con Stormglass
  scheduler/
    scheduler.ts             # Programación de envíos automáticos
.env                         # Variables de entorno (API keys)
```

---

## ⚙️ Instalación

```bash
# 1. Clona el repositorio
git clone <url-del-repo>
cd whatsapp-bot

# 2. Instala dependencias
npm install

# 3. Crea el archivo .env con tu clave de Stormglass
echo "STORMGLASS_API_KEY=tu_api_key_aqui" > .env

# 4. Compila TypeScript (opcional)
npm run build

# 5. O ejecuta directamente en modo desarrollo
npm run dev
```

---

## 🧠 Configuración de TypeScript

El proyecto está configurado en modo **no estricto**, ideal para desarrollos rápidos:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": false,
    "skipLibCheck": true
  }
}
```

---

## 🌊 Configuración del entorno (.env)

El bot usa variables de entorno para gestionar claves sensibles como la API key de Stormglass.

1. Instala `dotenv`:

   ```bash
   npm install dotenv
   ```

2. Crea el archivo `.env` en la raíz:

   ```
   STORMGLASS_API_KEY=tu_api_key_de_stormglass
   ```

3. En `src/app.ts`, añade al principio:

   ```ts
   import "dotenv/config";
   ```

4. Asegúrate de añadirlo al `.gitignore`:
   ```
   .env
   ```

---

## 💬 Uso básico

1. Ejecuta el bot:
   ```bash
   npm run dev
   ```
2. Escanea el **QR** que aparecerá en la terminal con tu WhatsApp.
3. Cuando veas `✅ Bot listo`, prueba comandos:

| Comando               | Descripción                                         |
| --------------------- | --------------------------------------------------- |
| `ping`                | Responde con `pong 🏓`                              |
| `echo <texto>`        | Repite el texto                                     |
| `!!help`              | Muestra la lista de comandos disponibles            |
| `!!group-id`          | Muestra el ID del grupo (solo dentro de grupos)     |
| `!!whatsguru {playa}` | Muestra datos de olas, viento y mareas (Stormglass) |

---

## 🧱 Extender el bot

### Crear un nuevo handler

Crea un archivo en `src/handlers/`, por ejemplo `HelloHandler.ts`:

```ts
import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";

export class HelloHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return ctx.body.trim() === "hola";
  }

  async handle(ctx: MessageContext): Promise<void> {
    await ctx.reply("👋 ¡Hola!");
  }

  getHelpMessage(): string {
    return "hola → responde con un saludo";
  }
}
```

Regístralo en `app.ts`:

```ts
registry.register(new HelloHandler());
```

---

### Restringir un handler a un usuario o grupo

```ts
import { PrivateWrapperHandler } from "./handlers/PrivateWrapperHandler";
import { GroupWrapperHandler } from "./handlers/GroupWrapperHandler";
import { HelloHandler } from "./handlers/HelloHandler";

const admin = "34600111222@c.us";
const group = "1234567890-1234567890@g.us";

registry.register(new PrivateWrapperHandler(new HelloHandler(), admin));
registry.register(new GroupWrapperHandler(new HelloHandler(), group));
```

---

## 🌊 Handler `WhatsGuruHandler`

Permite consultar condiciones marítimas mediante la **API de Stormglass**:

```bash
!!whatsguru {nombre de playa}
```

Ejemplo:

```
!!whatsguru salinas
```

Devuelve:

```
🌊 WhatsGuru — Playa de Salinas
📍 (43.5756, -5.9455)
🏄 Olas: 1.2 m · periodo 10 s
💨 Viento: 5 m/s 320°
🌡 Agua: 18.4 °C
🕒 Datos: 30/10 09:00
```

Puedes añadir tus playas en el objeto `BEACHES` dentro del handler con su latitud y longitud.

---

## ⏰ Programar mensajes

En `scheduler/scheduler.ts` puedes definir tareas automáticas:

```ts
import cron from "node-cron";
import { client } from "../whatsapp/client";

export function initScheduler() {
  // Envía todos los días a las 10:00
  cron.schedule("0 10 * * *", async () => {
    await client.sendMessage("34600111222@c.us", "Buenos días 👋");
  });
}
```

---

## 🧩 Handlers incluidos

| Handler                 | Descripción                             |
| ----------------------- | --------------------------------------- |
| `PingHandler`           | Responde a `ping`                       |
| `EchoHandler`           | Repite el texto tras `echo`             |
| `HelpHandler`           | Lista los comandos disponibles          |
| `GroupIdHandler`        | Muestra el ID del grupo actual          |
| `PrivateWrapperHandler` | Limita la ejecución a un número         |
| `GroupWrapperHandler`   | Limita la ejecución a un grupo          |
| `WhatsGuruHandler`      | Consulta el parte marítimo (Stormglass) |

---

## 🧹 .gitignore recomendado

```
node_modules
dist
.wwebjs_auth
.env
```

---

## 🧰 Scripts

| Script          | Descripción                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Ejecuta en modo desarrollo (ts-node) |
| `npm run build` | Compila TypeScript a JavaScript      |
| `npm start`     | Ejecuta el código compilado          |

---

## 📜 Licencia

MIT — libre para usar y modificar.

---

## 🧑‍💻 Autor

Desarrollado por **Adrokogit**.  
Arquitectura basada en handlers, wrappers y conexión a APIs externas como Stormglass.
