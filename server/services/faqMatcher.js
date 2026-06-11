function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

function matchFaq(userMessage, faqsArray) {
  const userTokens = normalize(userMessage);

  let bestMatch = null;
  let bestScore = 0;

  for (const faq of faqsArray) {
    const keywords = faq.keywords.map((k) => k.toLowerCase());
    const questionTokens = normalize(faq.question);

    const matchingKeywords = keywords.filter((kw) => {
      const kwTokens = kw.split(/\s+/);
      return kwTokens.every((t) => userTokens.includes(t));
    });
    const keywordScore = keywords.length > 0 ? matchingKeywords.length / keywords.length : 0;

    const matchingQTokens = questionTokens.filter((t) => userTokens.includes(t));
    const questionScore = questionTokens.length > 0 ? matchingQTokens.length / questionTokens.length : 0;

    const finalScore = keywordScore * 0.6 + questionScore * 0.4;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestMatch = faq;
    }
  }

  if (bestScore >= 0.25) {
    return { faq: bestMatch, confidence: Math.round(bestScore * 100) / 100 };
  }

  return null;
}

export default matchFaq;
