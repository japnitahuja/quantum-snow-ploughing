import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
        Header
      </header>

      <h1>
        Content
      </h1>

      <p>
        Map goes here
      </p>
      <footer>
        Footer
      </footer>
    </>
  )
}

export default App
