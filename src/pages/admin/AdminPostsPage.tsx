import { useState } from 'react'
import { useFirestoreCollection } from '../../hooks/useFirestore'
import { postsService } from '../../services/postsService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { Post } from '../../types'

const emptyPost = (): Omit<Post, 'id'> => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  publishedAt: new Date().toISOString(),
  author: 'Centrum Chabówka',
  status: 'draft',
  imageUrl: '',
  metaTitle: '',
  metaDescription: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export default function AdminPostsPage() {
  const { allItems } = useFirestoreCollection(postsService.subscribeAll)
  const [editing, setEditing] = useState<Partial<Post> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const { saving, message, run } = useAdminSave()

  const openNew = () => {
    setEditing(emptyPost())
    setIsNew(true)
  }

  const save = () => {
    if (!editing) return
    run(async () => {
      const data = { ...editing, updatedAt: new Date().toISOString() } as Post
      if (isNew) {
        data.createdAt = new Date().toISOString()
        await postsService.add(data as Omit<Post, 'id'>)
      } else if (editing.id) {
        await postsService.update(editing.id, data)
      }
      setEditing(null)
    })
  }

  const deletePost = (id: string) => {
    if (!confirm('Usunąć aktualność?')) return
    run(() => postsService.delete(id))
  }

  return (
    <div>
      <AdminPageHeader title="Aktualności" description="Zarządzaj postami na stronie" />
      <button type="button" onClick={openNew} className="mb-6 bg-secondary-container text-on-secondary px-4 py-2 rounded-lg font-bold text-sm">
        Dodaj aktualność
      </button>
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}

      <div className="space-y-3">
        {allItems.map((post) => (
          <div key={post.id} className="bg-white border border-outline-variant rounded-xl p-4 flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-bold text-primary">{post.title}</p>
              <p className="text-sm text-on-surface-variant">{post.status} · {new Date(post.publishedAt).toLocaleDateString('pl')}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setEditing(post); setIsNew(false) }} className="text-primary font-medium text-sm">Edytuj</button>
              <button type="button" onClick={() => deletePost(post.id)} className="text-red-600 font-medium text-sm">Usuń</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-8 bg-white border rounded-xl p-6 space-y-4 max-w-3xl">
          <Field label="Tytuł">
            <input className={inputClass} value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </Field>
          <Field label="Slug (URL)">
            <input className={inputClass} value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </Field>
          <Field label="Krótki opis">
            <textarea className={inputClass} rows={2} value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
          </Field>
          <Field label="Treść">
            <textarea className={inputClass} rows={8} value={editing.content ?? ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
          </Field>
          <Field label="URL obrazka">
            <input className={inputClass} value={editing.imageUrl ?? ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} />
          </Field>
          <Field label="Status">
            <select className={inputClass} value={editing.status ?? 'draft'} onChange={(e) => setEditing({ ...editing, status: e.target.value as Post['status'] })}>
              <option value="draft">Szkic</option>
              <option value="published">Opublikowany</option>
            </select>
          </Field>
          <Field label="Meta title">
            <input className={inputClass} value={editing.metaTitle ?? ''} onChange={(e) => setEditing({ ...editing, metaTitle: e.target.value })} />
          </Field>
          <Field label="Meta description">
            <textarea className={inputClass} rows={2} value={editing.metaDescription ?? ''} onChange={(e) => setEditing({ ...editing, metaDescription: e.target.value })} />
          </Field>
          <SaveButton onClick={save} saving={saving} />
        </div>
      )}
    </div>
  )
}
