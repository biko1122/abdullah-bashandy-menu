import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { MenuProvider } from './context/MenuContext'
import { SelectionProvider } from './context/SelectionContext'
import { FavoritesProvider } from './context/FavoritesContext'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MenuProvider>
        <SelectionProvider>
          <FavoritesProvider>
          <App />
          </FavoritesProvider>
        </SelectionProvider>
      </MenuProvider>
    </BrowserRouter>
  </StrictMode>
)
