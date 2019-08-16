import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Ajax from '../util/Ajax';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import { withRouter } from 'react-router';



const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    flexGrow: 1,
    color: '#ffffff',
    cursor: 'auto'
  },
  icon: {
    color: '#ffffff'
  },
  colorDefault:{
    color: '#dddd00'
  }
};

class MenuAppBar extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      anchorEl: null,
    };
    this.sendLogout = false;
    this.onClickLogout = this.onClickLogout.bind(this);
    // this.pushToHome = this.pushToHome.bind(this);
  }

  componentDidMount(){
    console.log(this.props.state)
    // if(!this.props.logedUser)
    //   this.props.history.push('/');
  }

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onClickLogout(){
    if (!this.sendLogout) {
      this.sendLogout = true;
      let logout = new Ajax('user/logout');
      logout.result().finally(() => {
        localStorage.removeItem('vntstdtkn');
        this.props.logout();
        this.sendLogout = false;
        Ajax.token = '';
        this.props.history.push('/');
    });
    }
  };

  // pushToHome(){
  //   if(this.props.logedUser)
  //     this.props.history.push('/');
  // }

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title} onClick={this.pushToHome}>
              Saltala Tickets
          </Typography>
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  className={classes.icon}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.onClickLogout}>Logout</MenuItem>
                </Menu>
              </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
} export default withRouter(connect(
  state=>({
    user: state.authReducer.logedUser,
    state: state.authReducer,
  }),
  {
    logout
  })(withStyles(styles)(MenuAppBar)));