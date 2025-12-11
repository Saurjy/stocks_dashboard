import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from "@/components/Header"


function App() {
  const [count, setCount] = useState(0)

  // NOTE: In a real React project, you'd want a common layout component 
  // that handles the Header and the content wrapper for all pages.
  
  return (
    <>
      {/* 1. The Fixed Header */}
      <Header />
      
      {/* 2. Content Wrapper with Top Padding */}
      {/* pt-16 ensures the content starts *below* the fixed h-16 header */}
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4">
          
          {/* --- Your Original Content Starts Here --- */}
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="text-4xl font-bold text-brand">
            Click on the Vite and React logos to learn more
          </p>

          {/* Add some space to demonstrate scrolling and the sticky header */}
          <div className="h-[200vh] mt-8 bg-white p-4 shadow-lg dark:bg-gray-700">
             <p className="text-lg">Scroll down to see the header stick to the top!</p>
          </div>
          {/* --- Your Original Content Ends Here --- */}

        </div>
      </div>
    </>
  )
}

export default App
