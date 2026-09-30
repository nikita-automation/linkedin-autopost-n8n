// Request body for the LinkedIn Posts API
const p = $('Parse response').first().json;
const author = 'urn:li:person:' + $('Get LinkedIn member ID').first().json.sub;
return [{ json: {
  author,
  postBody: {
    author,
    commentary: p.commentary,
    visibility: 'PUBLIC',
    distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
    content: { media: { title: p.articleTitle, id: $('Init image upload').first().json.value.image } },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  },
} }];
