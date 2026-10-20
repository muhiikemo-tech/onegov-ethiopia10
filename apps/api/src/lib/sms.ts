export async function sendSms(phone: string, message: string) {
  if (process.env.SMS_PROVIDER === "stub") {
    console.log(`\n=======================================`);
    console.log(`📱 [SMS TO]: ${phone}`);
    console.log(`💬 [MESSAGE]: ${message}`);
    console.log(`=======================================\n`);
    return;
  }

  if (process.env.SMS_PROVIDER === "afromessage") {
    try {
      const res = await fetch("https://api.afromessage.com/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AFROMESSAGE_API_KEY}`,
        },
        body: JSON.stringify({
          to: phone,
          message,
          from: process.env.AFROMESSAGE_IDENTIFIER || "OneGov",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("[SMS] Failed:", data);
        return;
      }
      console.log(`[SMS] Sent to ${phone}:`, data);
    } catch (e) {
      console.error("[SMS] Error:", e);
    }
  }
}
