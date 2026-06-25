import { useEffect } from 'react'
import { SITE_URL, SITE_NAME, DEFAULT_SEO } from '../lib/seo'

export interface SeoOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  jsonLd?: Record<string, unknown>
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertJsonLd(data: Record<string, unknown>) {
  const id = 'seo-json-ld'
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function useSeo(options: SeoOptions = {}) {
  const {
    title,
    description = DEFAULT_SEO.description,
    path = '',
    image,
    type = 'website',
    noIndex = false,
    jsonLd,
  } = options

  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_SEO.title
    const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

    document.title = pageTitle
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', DEFAULT_SEO.keywords)
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:title', pageTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:locale', 'pl_PL')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    if (image) upsertMeta('property', 'og:image', image)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', pageTitle)
    upsertMeta('name', 'twitter:description', description)

    upsertLink('canonical', url)

    if (jsonLd) upsertJsonLd(jsonLd)
  }, [title, description, path, image, type, noIndex, JSON.stringify(jsonLd)])
}

/** @deprecated Use useSeo */
export function usePageSeo(title?: string, description?: string) {
  useSeo({ title, description })
}
