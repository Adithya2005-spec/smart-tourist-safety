import { ragKnowledgeBase, type KnowledgeDocument } from "./rag-knowledge-base";

export interface RetrievalResult {
  document: KnowledgeDocument;
  relevanceScore: number;
  snippet: string;
}

export function retrieveKnowledge(query: string, topK: number = 3): RetrievalResult[] {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery.split(/\s+/).filter((t) => t.length > 2);

  const scoredDocs = ragKnowledgeBase.map((doc) => {
    let score = 0;

    // Check title match
    if (doc.title.toLowerCase().includes(normalizedQuery)) score += 10;

    // Check tag matches
    for (const tag of doc.tags) {
      if (normalizedQuery.includes(tag.toLowerCase())) score += 5;
      for (const token of queryTokens) {
        if (tag.toLowerCase().includes(token)) score += 2;
      }
    }

    // Check content matches
    for (const token of queryTokens) {
      if (doc.content.toLowerCase().includes(token)) score += 1;
    }

    return {
      document: doc,
      relevanceScore: score,
      snippet: doc.content.length > 200 ? `${doc.content.slice(0, 197)}...` : doc.content,
    };
  });

  return scoredDocs
    .filter((res) => res.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK);
}
