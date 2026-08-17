import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { execSync } from "node:child_process";
import { readFileSync, unlinkSync } from "node:fs";

const MODEL = `${process.env.HOME}/.whisper-models/ggml-base.bin`;

export default function (pi: ExtensionAPI) {
  pi.registerCommand("dictar", {
    description: "Dictado por voz. Graba, transcribe y envía como mensaje.",
    handler: async (args, ctx) => {
      const duration = parseInt(args, 10) || 8; // default 8 segundos
      const tmpFile = `/tmp/dictar_pi_${Date.now()}.wav`;

      // --- Grabar ---
      ctx.ui.setStatus("dictar", `🎤 Grabando ${duration}s...`);
      ctx.ui.notify(`🎤 Grabando (${duration}s)... hablá ahora`, "info");

      try {
        execSync(
          `ffmpeg -f avfoundation -i ":0" -ac 1 -ar 16000 -t ${duration} -y "${tmpFile}" 2>/dev/null`,
          { timeout: (duration + 5) * 1000 },
        );
      } catch {
        ctx.ui.setStatus("dictar", "");
        ctx.ui.notify("❌ Error grabando audio. ¿AirPods conectados?", "error");
        return;
      }

      // Verificar que grabó algo
      let size = 0;
      try { size = readFileSync(tmpFile).length; } catch {}
      if (size < 1000) {
        ctx.ui.setStatus("dictar", "");
        ctx.ui.notify("⚠️  No se detectó audio", "error");
        try { unlinkSync(tmpFile); } catch {}
        return;
      }

      // --- Transcribir ---
      ctx.ui.setStatus("dictar", "⏳ Transcribiendo...");
      ctx.ui.notify("⏳ Transcribiendo con whisper...", "info");

      try {
        execSync(
          `whisper-cli -m "${MODEL}" -f "${tmpFile}" -l es -otxt --no-prints --no-timestamps 2>/dev/null`,
          { timeout: 30_000 },
        );
      } catch {
        ctx.ui.setStatus("dictar", "");
        ctx.ui.notify("❌ Error en transcripción", "error");
        try { unlinkSync(tmpFile); } catch {}
        return;
      }

      // --- Leer resultado ---
      const outFile = `${tmpFile}.txt`;
      let text = "";
      try {
        text = readFileSync(outFile, "utf-8")
          .replace(/^\s*\[M[UÚ]SICA?\]|\[SPEECH\]|\[BLANK_AUDIO\]|\[SILENCE\]|\[INAUDIBLE\]/gim, "")
          .trim();
      } catch {}

      // Limpiar temporales
      try { unlinkSync(tmpFile); } catch {}
      try { unlinkSync(outFile); } catch {}

      ctx.ui.setStatus("dictar", "");

      if (!text) {
        ctx.ui.notify("⚠️  No se detectó voz. ¿AirPods puestos? Hablá más fuerte.", "error");
        return;
      }

      ctx.ui.notify(`📝 "${text.substring(0, 80)}${text.length > 80 ? "…" : ""}"`, "info");

      // --- Enviar como mensaje de usuario ---
      pi.sendUserMessage(text);
    },
  });
}
