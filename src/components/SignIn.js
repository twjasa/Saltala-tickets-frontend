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
import Ajax from '../util/Ajax';

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
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    },()=>{
      if(this.state.email!==""){
        this.setState({isEmailEmpty:false});
      }
      if(this.state.password!==""){
        this.setState({isPasswordEmpty:false});        
      }
    });
    
  };

  handleClickSignIn = () => {
    console.log(this.state.email)
    if (this.state.email === '')
      this.setState({ isEmailEmpty: true });

    if (this.state.password === '')
      this.setState({ isPasswordEmpty: true });

    if (this.state.password !== '' && this.state.email !== '') {
      // do sign in and redirect to tickets
      let request = new Ajax('user/login', {
        method: 'POST',
        body: {
          email: this.state.email,
          password: this.state.password,
        }
      });
    }
  };


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
} export default withStyles(styles)(SignIn);
