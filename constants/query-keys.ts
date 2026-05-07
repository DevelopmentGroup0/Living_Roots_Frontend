export const QUERY_KEYS = {
  herbs: {
    all: ['herbs'] as const,
    detail: (id: string) => ['herbs', id] as const,
  },
  symptoms: {
    search: (query: string) => ['symptoms', 'search', query] as const,
  },
} as const