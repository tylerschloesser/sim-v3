import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import { App } from './app.component.js'

const container = document.getElementById('app')
invariant(container)

createRoot(container).render(<App />)
