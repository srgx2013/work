import { describe, it, expect } from 'vitest'

describe('Smoke test', () => {
  it('renders a basic DOM element', () => {
    const el = document.createElement('div')
    el.textContent = 'Hello'
    el.id = 'smoke'
    document.body.appendChild(el)

    expect(document.getElementById('smoke')).not.toBeNull()
    expect(document.getElementById('smoke')!.textContent).toBe('Hello')
  })
})