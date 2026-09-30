// Post is live: remember the article so it is never published twice
const p = $('Parse response').first().json;
const state = $getWorkflowStaticData('global');
state.usedPostIds = [p.articleId, ...(state.usedPostIds || [])].slice(0, 200);

const urn = ($json.headers && ($json.headers['x-restli-id'] || $json.headers['X-RestLi-Id'])) || '';
return [{ json: { urn } }];
