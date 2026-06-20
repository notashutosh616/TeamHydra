// Shared loading + empty states for the OUR MEMORIES gallery.

function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`${className} animate-spin text-hydra`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// Shimmering skeleton tiles that mirror the gallery layout.
export function GalleryLoading({ count = 6 }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="mb-6 flex items-center justify-center gap-2.5 text-sm text-slatey">
        <Spinner />
        Loading memories…
      </div>
      <ul className="grid grid-flow-row-dense auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[230px] sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <li
            key={i}
            className={`relative overflow-hidden rounded-2xl border border-white/10 glass ${
              i % 4 === 0 ? 'sm:col-span-2' : ''
            }`}
          >
            <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </li>
        ))}
      </ul>
    </div>
  )
}

// Friendly empty / not-configured state.
export function GalleryEmpty({ title, hint }) {
  return (
    <div className="grid place-items-center rounded-3xl glass px-6 py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
        <svg className="h-8 w-8 text-ember" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="1.6" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </span>
      <p className="mt-5 font-hand text-3xl text-ember-soft">{title}</p>
      {hint && <p className="mt-2 max-w-md text-sm leading-relaxed text-slatey">{hint}</p>}
    </div>
  )
}
