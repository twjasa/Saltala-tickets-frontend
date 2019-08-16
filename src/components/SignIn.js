import React from 'react';
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined';
import Typography from '@material-ui/core/Typography';
import logo from '../assets/img/logo.png'
import '../assets/css/SiteSignIn.css'
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { requestAuth, clearErrorMessage } from '../redux/actions/authActions';



const styles = theme => ({
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: '10px',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '10px'
  },
  submit: {
    backgroundColor: "#3b99fc",
    width: '50%',
    margin: '10px 0px 10px 0px'
  },
  avatar: {
    backgroundColor: '#ff5fb3',
    marginBottom: '10px'
  }
});


class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmailEmpty: false,
      isPasswordEmpty: false,
      email: '',
      password: '',
    };
    this.pressEnterOnPassword = this.pressEnterOnPassword.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    }, () => {
      if (this.state.email !== "") {
        this.setState({ isEmailEmpty: false });
      }
      if (this.state.password !== "") {
        this.setState({ isPasswordEmpty: false });
      }
    });

  };

  handleClickSignIn = () => {
    if (this.state.email === '')
      this.setState({ isEmailEmpty: true });

    if (this.state.password === '')
      this.setState({ isPasswordEmpty: true });

    if (this.state.password !== '' && this.state.email !== '') {
      // do sign in and redirect to tickets
      this.storeTokenInRedux();
    }
  };

  handleClickCheckToken = () => {
    console.log(this.props.logedUser)
    console.log(this.props.tokenFromApi)
  };

  storeTokenInRedux() {
    // request a new token to API
    return this.props.requestAuth({
      email: this.state.email,
      password: this.state.password
    });
  }

  componentDidUpdate() {
    // console.log(this.props.logedUser)
    // if (this.props.logedUser) {
    //   localStorage.setItem('vntstdtkn', JSON.stringify(this.props.reducer));
    //   this.props.history.push('/tickets');
    // }
    console.log(this.props.reducer)
    if (this.props.tokenFromApi) {
      localStorage.setItem('vntstdtkn', JSON.stringify(this.props.reducer));
      if (!this.props.history.location.state) {
        return this.props.history.goBack();
      }
      if (this.props.history.location.state.fromSignIn || this.props.history.location.state.fromReset) {
        return this.props.history.push('/');
      }
    }
  }

  pressEnterOnPassword(evnt) {
    if (evnt.key === 'Enter') {
      this.storeTokenInRedux();
    }
  }

  componentDidMount(){
    console.log(this.props.logedUser)
  }


  render() {
    const { classes } = this.props;
    return (
      <div className="signin-container">
        <div className="logo-container">
          <img className="img" src={logo} />
        </div>
        <Paper className={classes.paper} elevation={1}>
          <Avatar className={classes.avatar}>
            <LocalHospitalOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inicia Sesion
        </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            error={this.state.isEmailEmpty}
            autoComplete="email"
            autoFocus
            onChange={this.handleChange('email')}
            value={this.state.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            error={this.state.isPasswordEmpty}
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={this.handleChange('password')}
            value={this.state.password}
            onKeyDown={this.pressEnterOnPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.handleClickSignIn}
          >
            Iniciar Sesion
          </Button>
          {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.handleClickCheckToken}
          >
            CheckToken
          </Button> */}
          <Grid container>
            <Grid item>
              <Link href="/registrate" variant="body2">
                {"No tienes una cuenta? Registrate"}
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
} export default withRouter(connect(
  state => ({
    reducer: state.authReducer,
    loadingRequest: state.authReducer.loading,
    requestError: state.authReducer.error,
    tokenFromApi: state.authReducer.successfulRequest,
    logedUser: state.authReducer.logedUser,
  }),
  {
    requestAuth,
    clearErrorMessage,
  })(withStyles(styles)(SignIn)));
