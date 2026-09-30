// Parse Claude's answer and convert the post to LinkedIn "little text" format
// the model may return a thinking block first — take the text block
const raw = (($json.content || []).find(b => b.type === 'text') || {}).text || '';
let data;
try {
  data = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, ''));
} catch (e) {
  throw new Error('Claude did not return JSON: ' + raw.slice(0, 200));
}

const candidates = $('Select candidates').first().json.candidates;
const article = candidates[Number(data.index)];
if (!article) throw new Error('Claude picked a non-existent article: ' + data.index);

const post = String(data.post || '').trim();
if (post.length < 300 || post.length > 2500) {
  throw new Error(`Suspicious post length (${post.length} characters)`);
}

// LinkedIn little text: reserved characters must be escaped, hashtags use a template
const commentary = post
  .replace(/[\\(){}\[\]<>@|~_*]/g, ch => '\\' + ch)
  .replace(/#([\p{L}\p{N}]+)/gu, '{hashtag|\\#|$1}');

return [{ json: {
  articleId: article.id,
  articleTitle: article.title,
  articleLink: article.link,
  image: article.image,
  post,
  commentary,
} }];
