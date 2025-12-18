import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

let client;

export const initializeWhatsApp = () => {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    console.log("\n=================================================");
    console.log("SCAN THIS QR CODE WITH WHATSAPP TO LOGIN:");
    console.log("=================================================\n");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("\n✅ WhatsApp Client is Ready!");
  });

  client.on("authentication_failure", (msg) => {
    console.error("❌ WhatsApp Authentication Failed:", msg);
  });

  client.initialize();
};

export const sendMessage = async (to, message) => {
  if (!client) {
    throw new Error("WhatsApp client not initialized");
  }

  try {
    // WhatsApp requires phone numbers in specific format (e.g., 919876543210@c.us)
    const formattedNumber = to.includes("@c.us")
      ? to
      : `${to.replace(/[^0-9]/g, "")}@c.us`;

    const response = await client.sendMessage(formattedNumber, message);
    return response;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

export const getClientStatus = () => {
  return client && client.info ? "connected" : "disconnected";
};
