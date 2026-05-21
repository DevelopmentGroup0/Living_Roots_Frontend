export const herbKeys = {
  all: ['herbs'] as const,
  detail: (id: string) => [...herbKeys.all, id] as const,
}
