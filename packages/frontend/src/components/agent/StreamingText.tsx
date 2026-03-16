import { useTypewriter } from '../../hooks/useTypewriter'
import { cn } from '../../utils/cn'

interface StreamingTextProps {
  text: string
  speed?: number
  onComplete?: () => void
  enabled?: boolean
  className?: string
}

export function StreamingText({ text, speed, onComplete, enabled = true, className }: StreamingTextProps) {
  const { displayedText, isComplete } = useTypewriter(text, { speed, onComplete, enabled })

  // Parse simple markdown-like formatting
  const rendered = parseText(displayedText)

  return (
    <div className={cn('text-sm text-slate-200 leading-relaxed', className)}>
      {rendered}
      {!isComplete && <span className="inline-block w-0.5 h-4 bg-slate-400 animate-pulse ml-0.5 align-text-bottom" />}
    </div>
  )
}

function parseText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const lines = text.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('• ') || line.startsWith('- ')) {
      parts.push(
        <div key={i} className="flex gap-2 ml-2 mt-1">
          <span className="text-slate-500 shrink-0">•</span>
          <span>{parseBold(line.slice(2))}</span>
        </div>
      )
    } else if (line === '') {
      parts.push(<div key={i} className="h-2" />)
    } else {
      parts.push(<p key={i} className={i > 0 ? 'mt-1' : ''}>{parseBold(line)}</p>)
    }
  }

  return parts
}

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    }
    return part
  })
}
