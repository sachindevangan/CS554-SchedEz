// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React from 'react';
import "./App.css"
import {Route, Routes} from 'react-router-dom';
import Account from './components/Account';
import Home from './components/Home';
import Landing from './components/Landing';
import Navigation from './components/Navigation';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import EventList from './components/EventList';
import EventListingPage from './components/EventListingPage';
import EventDetail from './components/EventDetail';
import UpdateProfile from './components/UpdateProfile';
import EventsToday from './components/EventsToday';
import RequestList from './components/RequestList';
function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <header className='App-header'>
          <Navigation />
        </header>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/home' element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
           <Route path='/account' element={<PrivateRoute />}>
            <Route path='/account' element={<Account />} />
          </Route>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/all-events' element= {<EventListingPage/>} />
          <Route path="/event/:eventId" element={<EventDetail/>} />
          <Route path="/update-profile" element={<UpdateProfile/>} />
          <Route path='/events-today' element={<EventsToday/>}/>
          <Route path='/invites' element={<RequestList/>}/>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;