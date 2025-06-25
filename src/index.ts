import TelegramBot from "node-telegram-bot-api";

import type { Message, CallbackQuery } from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN tidak ditemukan di .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// ======== /start Command Handler =========
bot.onText(/^\/start$/, (msg: Message) => {
  const chatId = msg.chat.id;

  const menuKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📚 Belajar", callback_data: "menu_belajar" }],
        [{ text: "📢 Info Bot", callback_data: "menu_info" }],
      ],
    },
  };

  bot.sendMessage(
    chatId,
    "👋 Selamat datang di *Belajar Bot!* Silakan pilih menu:",
    {
      ...menuKeyboard,
      parse_mode: "Markdown",
    }
  );
});

// ======== Callback Query Handler =========
bot.on("callback_query", (callbackQuery: CallbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  if (!msg || !data) return;

  switch (data) {
    case "menu_belajar":
      bot.sendMessage(
        msg.chat.id,
        "🧠 Kamu memilih *Belajar*. Apa yang ingin kamu pelajari hari ini?",
        {
          parse_mode: "Markdown",
        }
      );
      break;
    case "menu_info":
      bot.sendMessage(
        msg.chat.id,
        "ℹ️ Ini adalah bot demo interaktif berbasis Node.js dan TypeScript.\n\nSource code-nya bisa kamu kembangkan sendiri!"
      );
      break;
    default:
      bot.sendMessage(msg.chat.id, `Kamu memilih: ${data}`);
  }

  // Selalu jawab callback agar tombol tidak loading terus
  bot.answerCallbackQuery(callbackQuery.id);
});

// ======== Fallback Pesan Lain =========
bot.on("message", (msg: Message) => {
  const chatId = msg.chat.id;

  // Hanya balas jika bukan command
  if (!msg.text?.startsWith("/")) {
    bot.sendMessage(chatId, "Ketik /start untuk membuka menu.");
  }
});
