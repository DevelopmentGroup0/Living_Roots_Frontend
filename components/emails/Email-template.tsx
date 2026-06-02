interface EmailTemplateProps {
  message: string
}

export default function EmailTemplate({ message }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        color: '#333',
      }}
    >
      <h1 style={{ color: '#065f46' }}>¡Bienvenido a Living Roots!</h1>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{message}</p>
    </div>
  )
}
