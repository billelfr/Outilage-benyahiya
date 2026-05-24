function escapeTelegram(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return "- No items";
  }

  return items
    .map((item) => `- ${escapeTelegram(item.name || "Product")} x${Number(item.quantity) || 1}`)
    .join("\n");
}

function formatDzd(value) {
  return `${new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 2 }).format(Number(value) || 0)} DZD`;
}

export async function sendTelegramOrderNotification(order) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram bot credentials are not configured.");
  }

  const message = [
    "🛒 <b>New Order Received</b>",
    "",
    `Order ID: #${escapeTelegram(order.id)}`,
    `Name: ${escapeTelegram(order.user_name)}`,
    `Phone: ${escapeTelegram(order.user_phone)}`,
    `Address: ${escapeTelegram(order.address)}`,
    `Description: ${escapeTelegram(order.description)}`,
    "",
    "Items:",
    formatItems(order.items),
    "",
    `Total: ${formatDzd(order.total_price)}`,
    "",
    `Status: ${escapeTelegram(order.status || "pending")}`,
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram notification failed: ${details}`);
  }
}
