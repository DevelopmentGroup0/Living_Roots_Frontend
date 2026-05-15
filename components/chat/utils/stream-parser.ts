export function parseSSEChunk(
  chunk: string,
  onContent: (content: string) => void,
) {
  const lines = chunk.split('\n')

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const data = JSON.parse(line.replace('data: ', ''))

        if (data.content) {
          onContent(data.content)
        }
      } catch {
        // Ignorar chunks inválidos
      }
    }
  }
}
