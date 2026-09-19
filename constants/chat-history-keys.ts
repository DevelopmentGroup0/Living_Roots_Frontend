export const chatHistoryKeys = {
  all: ['chat-history'] as const,
  preview: () => [...chatHistoryKeys.all, 'preview'] as const,
  infinite: (sortBy: string) =>
    [...chatHistoryKeys.all, 'infinite', sortBy] as const,
}
