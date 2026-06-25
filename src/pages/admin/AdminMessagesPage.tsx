import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFirestoreCollection } from '../../hooks/useFirestore'
import { messagesService } from '../../services/messagesService'
import { AdminPageHeader, Field, inputClass } from '../../components/admin/AdminUi'
import type { MessageStatus } from '../../types'
import { MESSAGE_STATUS_LABELS } from '../../types'

export default function AdminMessagesPage() {
  const { allItems: messages } = useFirestoreCollection(messagesService.subscribe)
  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const selectedMsg = messages.find((m) => m.id === selected)
  const newCount = messagesService.countNew(messages)

  const updateStatus = async (id: string, status: MessageStatus) => {
    await messagesService.updateStatus(id, status, note || undefined)
    setSelected(null)
    setNote('')
  }

  return (
    <div>
      <AdminPageHeader title={`Skrzynka${newCount > 0 ? ` (${newCount})` : ''}`} description="Wiadomości i zgłoszenia" />

      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-secondary-container ${m.status === 'new' ? 'border-secondary-container' : ''}`}
            onClick={() => { setSelected(m.id); setNote(m.adminNote ?? '') }}
          >
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-bold text-primary">{m.subject}</p>
                <p className="text-sm text-on-surface-variant">
                  {m.userName} · {m.userEmail} · {m.type} · {new Date(m.createdAt).toLocaleString('pl-PL')}
                </p>
              </div>
              <span className="text-label-sm font-bold px-3 py-1 rounded-full bg-surface-container-low">
                {MESSAGE_STATUS_LABELS[m.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-primary">{selectedMsg.subject}</h2>
            <p className="text-sm whitespace-pre-wrap">{selectedMsg.content}</p>
            {selectedMsg.phone && (
              <p className="text-sm">
                Tel: <a href={`tel:${selectedMsg.phone}`} className="text-secondary-container font-medium">{selectedMsg.phone}</a>
              </p>
            )}
            <p className="text-sm">
              E-mail: <a href={`mailto:${selectedMsg.userEmail}`} className="text-secondary-container font-medium">{selectedMsg.userEmail}</a>
            </p>
            {selectedMsg.relatedEnrollmentId && (
              <Link to="/admin/enrollments" className="text-sm text-secondary-container underline">
                Powiązane zgłoszenie
              </Link>
            )}
            <Field label="Notatka">
              <textarea className={inputClass} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              {(['read', 'in_contact', 'confirmed', 'rejected', 'completed', 'archived'] as MessageStatus[]).map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(selectedMsg.id, s)} className="px-3 py-2 rounded-lg text-sm bg-surface-container-low">
                  {MESSAGE_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setSelected(null)} className="text-sm">Zamknij</button>
          </div>
        </div>
      )}
    </div>
  )
}
