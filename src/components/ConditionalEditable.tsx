import { lazy, Suspense, type ElementType, type ReactNode } from 'react'
import { useEditMode } from '../contexts/EditModeContext'

const EditableText = lazy(() => import('./live-edit/EditableText'))

type ConditionalEditableProps = {
  value: string
  onSave: (value: string) => Promise<void>
  label?: string
  multiline?: boolean
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
}

export default function ConditionalEditable({
  value,
  onSave,
  label,
  multiline,
  className = '',
  as: Tag = 'span',
}: ConditionalEditableProps) {
  const { canEdit } = useEditMode()

  if (!canEdit) {
    return <Tag className={className}>{value}</Tag>
  }

  return (
    <Suspense fallback={<Tag className={className}>{value}</Tag>}>
      <EditableText
        value={value}
        onSave={onSave}
        label={label}
        multiline={multiline}
        className={className}
        as={Tag}
      />
    </Suspense>
  )
}

export function StableText({
  as: Tag = 'span',
  className = '',
  children,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  return <Tag className={className}>{children}</Tag>
}
