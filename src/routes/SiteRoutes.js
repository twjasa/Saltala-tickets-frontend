import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
// body content components

class SiteRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' render={(props) => {
          return (
            <div id='full-site-wrapper'>
              <Header/>
            </div>
          );
        }
        }
        />
      </Switch>
    );
  }
}export default SiteRoutes;
