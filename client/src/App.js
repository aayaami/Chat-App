import React, { Fragment, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import { Provider } from 'react-redux'
import store from './store'
import Alert from './components/layout/Alert'
import setAuthToken from './utils/setAuthToken'
import { loadUser } from './actions/auth'
import Chats from './components/chats/Chats'
import PrivateRoute from './components/routing/PrivateRoute'
import Chat from './components/chats/Chat';
import WebSocketIo from './utils/WebSocketIo';


if(localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
        <WebSocketIo />
          <section className="grid-wrapper">
            <Navbar />
            <Alert />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/chats" component={Chats} />
              <PrivateRoute exact path="/chats/:chat_id" component={Chat} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}


export default App
