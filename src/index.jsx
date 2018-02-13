import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

const Header = () => (
  <ul>
    <li><a href="/logout">Log Out</a></li>
  </ul>
);

const Main = () => (
  <main>
    <Switch>
      <Route path="/profile" />
    </Switch>
  </main>
);

export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

ReactDom.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('root')
);
