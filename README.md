# 🤖 WhatsApp Bot (Node.js + TypeScript)

Bot modular para WhatsApp construido con **whatsapp-web.js**, escrito en **TypeScript (modo no estricto)**, y diseñado para ser fácilmente extensible mediante *handlers* y *wrappers*.

---

## 🚀 Características principales

- ✅ Desarrollado en **Node.js + TypeScript**
- 🧩 Arquitectura basada en **handlers** (clases independientes por comando)
- 🧱 Soporte para **wrappers**:
  - `PrivateWrapperHandler` → restringe un handler a un número concreto  
  - `GroupWrapperHandler` → restringe un handler a un grupo concreto
- ⏰ **Scheduler** con `node-cron` y `setTimeout` para programar mensajes
- 💬 Sistema de **ayuda automática** con el comando `!!help`
- 🔐 Autenticación local (`LocalAuth`) para conservar la sesión de WhatsApp

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
    ...
  scheduler/
    scheduler.ts             # Programación de envíos automáticos
```

---

## ⚙️ Instalación

```bash
# 1. Clona el repositorio
git clone <url-del-repo>
cd whatsapp-bot

# 2. Instala dependencias
npm install

# 3. Compila TypeScript (opcional)
npm run build

# 4. O ejecuta directamente en modo desarrollo
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

## 💬 Uso básico

1. Ejecuta el bot:
   ```bash
   npm run dev
   ```
2. Escanea el **QR** que aparecerá en la terminal con tu WhatsApp.
3. Cuando veas `✅ Bot listo`, prueba comandos:

| Comando | Descripción |
|----------|--------------|
| `ping` | Responde con `pong 🏓` |
| `echo <texto>` | Repite el texto |
| `!!help` | Muestra la lista de comandos disponibles |
| `!!group-id` | Muestra el ID del grupo (solo dentro de grupos) |

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

| Handler | Descripción |
|----------|--------------|
| `PingHandler` | Responde a `ping` |
| `EchoHandler` | Repite el texto tras `echo` |
| `HelpHandler` | Lista los comandos disponibles |
| `GroupIdHandler` | Muestra el ID del grupo actual |
| `PrivateWrapperHandler` | Limita la ejecución a un número |
| `GroupWrapperHandler` | Limita la ejecución a un grupo |

---

## 🧹 .gitignore recomendado

```
node_modules
dist
.wwebjs_auth
```

---

## 🧰 Scripts

| Script | Descripción |
|--------|--------------|
| `npm run dev` | Ejecuta en modo desarrollo (ts-node) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta el código compilado |

---

## 📜 Licencia

MIT — libre para usar y modificar.

---

## 🧑‍💻 Autor

Desarrollado por **Coquito**.  
Arquitectura basada en handlers y wrappers para bots escalables en WhatsApp.
