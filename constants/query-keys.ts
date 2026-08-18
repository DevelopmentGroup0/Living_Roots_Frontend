export const QUERY_KEYS = {
  herbs: {
    all: ['herbs'] as const,
    detail: (id: string) => ['herbs', id] as const,
  },
  symptoms: {
    search: (query: string) => ['symptoms', 'search', query] as const,
  },
  stories: {
    all: ['stories'] as const,
    published: (filters?: Record<string, unknown>) =>
      ['stories', 'published', ...(filters ? [filters] : [])] as const,
    mine: (filters?: Record<string, unknown>) =>
      ['stories', 'mine', ...(filters ? [filters] : [])] as const,
    detail: (id: string) => ['stories', id] as const,
    tags: {
      search: (query: string) => ['stories', 'tags', 'search', query] as const,
    },
  },
} as const
