import type { IPost } from "@/types/post.type";

export const getTrendingWords = (
  posts: IPost[],
  limit: number = 5,
): string[] => {
  if (!posts || posts.length === 0) return [];

  const stopWords = new Set([
    "et",
    "in",
    "non",
    "qui",
    "est",
    "quia",
    "sed",
    "ut",
    "quod",
    "aut",
    "sunt",
    "vel",
    "quo",
    "ea",
    "id",
    "ad",
    "sit",
    "ex",
    "enim",
    "cum",
    "eum",
    "est",
    "qui",
    "de",
    "voluptatem",
    "dolor",
    "omnis",
    "eos",
    "nihil",
    "sint",
    "autem",
    "hic",
    "itaque",
  ]);

  const wordCounts: Record<string, number> = {};

  posts.forEach((post) => {
    const text = `${post.title} ${post.body}`.toLowerCase();

    const words = text.match(/[a-z]+/g) || [];

    words.forEach((word) => {
      if (word.length > 4 && !stopWords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });

  const sortedWords = Object.entries(wordCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, limit)
    .map(([word]) => word);

  return sortedWords;
};
