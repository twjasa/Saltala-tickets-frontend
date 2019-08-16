import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import BodyTickets from '../components/BodyTickets'; 
import BodyAdminTickets from '../components/BodyAdminTickets'; 
// body content components

class SiteRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' render={(props) => {
          return (
            <div id='full-site-wrapper'>
              <SignIn />
            </div>
          );
        }}/>
        <Route exact path='/registrate' render={(props) => {
          return (
            <div id='full-site-wrapper'>
              <SignUp/>
            </div>
          );
        }}/>
        <Route exact path='/tickets' render={(props) => {
          return (
            <div id='full-site-wrapper'>
              <Header/>
              <BodyTickets/>
            </div>
          );
        }}/>
        <Route exact path='/admin' render={(props) => {
          return (
            <div id='full-site-wrapper'>
              <Header/>
              <BodyAdminTickets/>
            </div>
          );
        }}/>
      </Switch>
    );
  }
} export default SiteRoutes;
