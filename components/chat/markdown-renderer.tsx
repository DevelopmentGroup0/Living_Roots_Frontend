'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface Props {
  content: string
}

export function MarkdownRenderer({ content }: Props) {
  return (
    <div className='markdown-body'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className='text-2xl font-bold mt-6 mb-4'>{children}</h1>
          ),

          h2: ({ children }) => (
            <h2 className='text-xl font-semibold mt-5 mb-3'>{children}</h2>
          ),

          h3: ({ children }) => (
            <h3 className='text-lg font-semibold mt-4 mb-2'>{children}</h3>
          ),

          p: ({ children }) => (
            <p className='leading-7 mb-4 text-sm'>{children}</p>
          ),

          ul: ({ children }) => (
            <ul className='list-disc pl-6 mb-4 space-y-2'>{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className='list-decimal pl-6 mb-4 space-y-2'>{children}</ol>
          ),

          li: ({ children }) => (
            <li className='text-sm leading-6'>{children}</li>
          ),

          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-green-500 pl-4 italic my-4 text-gray-600'>
              {children}
            </blockquote>
          ),

          code(props) {
            const { children, className } = props

            const isInline = !className?.includes('language-')

            if (isInline) {
              return (
                <code className='rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-green-700'>
                  {children}
                </code>
              )
            }

            return (
              <pre className='overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100 my-4'>
                <code className={className}>{children}</code>
              </pre>
            )
          },

          table: ({ children }) => (
            <div className='overflow-x-auto my-4'>
              <table className='w-full border-collapse border border-gray-300 text-sm'>
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className='border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold'>
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className='border border-gray-300 px-3 py-2'>{children}</td>
          ),

          a: ({ children, href }) => (
            <a
              href={href}
              target='_blank'
              className='text-green-600 underline hover:text-green-700'
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
