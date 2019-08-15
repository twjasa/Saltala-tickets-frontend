import React from 'react';
// import the sections componetns
import Ajax from '../util/Ajax';
import SiteRoutes from '../routes/SiteRoutes';
import {connect} from 'react-redux';
import {getTokenFromLocalStorage} from '../redux/actions/authActions';
import { withRouter } from 'react-router';


class Site extends React.Component{
    constructor(props) {
      super (props);
      this.state = {
        searchingUser: false
      };
      this.saveSessionInRedux();
      this.saveTokenInRequests();
    }

    componentDidUpdate(prevProps){
      this.saveTokenInRequests();
    }

    getOauthToken() {
      if (localStorage.getItem('vntstdtkn')){
        return `${JSON.parse(localStorage.getItem('vntstdtkn')).tokenData.token_type} ${JSON.parse(localStorage.getItem('vntstdtkn')).tokenData.token}`;
      }
      else return false;
    }

    saveTokenInRequests() {
      if (Ajax.token) return;
      const token = this.getOauthToken();
      if (token) {
        Ajax.token = token;
      }
    }
    
    verifyAuthTokenInLocalStorage() {
      if (localStorage.getItem('vntstdtkn') === null)
        return false;
      else
        return true;
    }

    saveSessionInRedux() {
      if (this.verifyAuthTokenInLocalStorage()) {
        this.props.getTokenFromLocalStorage();
        return;
      } else {
        this.noUserLoged = true;
      }
    }

    appRenderDecider() {
      if (this.verifyAuthTokenInLocalStorage()) {
        if (this.props.user) {
          return (
            <SiteRoutes />
          );
        }
      }
      return (
        <SiteRoutes />
      );
    }

    render() {
      return this.appRenderDecider();
    }
}

// export default Site;
export default withRouter(connect(
    state => ({
      user: state.authReducer.logedUser,
    }),
    {
      getTokenFromLocalStorage,
    })(Site));
