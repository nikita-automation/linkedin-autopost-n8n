// Pick up to 6 recent blog posts that have not been published to LinkedIn yet and build the Claude request
const state = $getWorkflowStaticData('global');
// usedPostIds is only persisted on scheduled (production) runs; add manually published posts to excludePostIds in Settings
const manual = String($('Settings').first().json.excludePostIds || '')
  .split(',').map(s => Number(s.trim())).filter(Boolean);
const used = [...(state.usedPostIds || []), ...manual];

const clean = (html) => String(html || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/&#8222;|&#8220;/g, '"')
  .replace(/&#8217;/g, "'").replace(/&#\d+;/g, '')
  .replace(/\s+/g, ' ').trim();

const candidates = $input.all()
  .map(i => i.json)
  .filter(p => !used.includes(p.id))
  .filter(p => p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0] && p._embedded['wp:featuredmedia'][0].source_url)
  .slice(0, 6)
  .map(p => ({
    id: p.id,
    link: p.link,
    title: clean(p.title && p.title.rendered),
    image: p._embedded['wp:featuredmedia'][0].source_url,
    text: clean(p.content && p.content.rendered).slice(0, 3000),
  }));

if (candidates.length === 0) {
  throw new Error('No new blog posts with a featured image — LinkedIn post skipped');
}

const userMessage = candidates
  .map((c, i) => `### Article ${i}\nTitle: ${c.title}\n\n${c.text}`)
  .join('\n\n');

return [{ json: {
  candidates,
  claudeRequest: {
    model: 'claude-sonnet-5',
    max_tokens: 1500,
    system: $('Settings').first().json.systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  },
} }];
