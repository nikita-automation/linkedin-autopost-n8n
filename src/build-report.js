// Telegram report + reminder to renew LinkedIn access (token lives 60 days)
const p = $('Parse response').first().json;
const urn = $json.urn;
const s = $('Settings').first().json;

const days = Math.floor((Date.now() - new Date(s.linkedinConnectedAt).getTime()) / 86400000);
const left = 60 - days;

let text = `✅ LinkedIn-Post veröffentlicht\n\n„${p.articleTitle}"\n` +
  (urn ? `https://www.linkedin.com/feed/update/${urn}/` : '');

if (left <= 10) {
  text += `\n\n🔑 Der LinkedIn-Zugang läuft in ~${Math.max(left, 0)} Tagen ab. ` +
    'n8n → Credentials → LinkedIn → Reconnect, danach linkedinConnectedAt im Node „Settings" auf das heutige Datum setzen.';
}
return [{ json: { text } }];
