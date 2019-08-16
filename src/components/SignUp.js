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
    margin: '20px 0px 20px 0px'
  },
  avatar: {
    backgroundColor: '#ff5fb3',
    marginBottom: '10px'
  },
  typography: {
    marginBottom: '10px'
  },
  successMessage: {
    marginBottom: '10px',
    marginTop: '10px',
    color: '#00FF00'
  }
});


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmptyName: false,
      isEmptyLastname: false,
      isEmptyEmail: false,
      isEmptyPassword: false,
      name: '',
      lastname: '',
      email: '',
      password: '',
      success: false,
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    }, () => {
      if (this.state.email !== "")
        this.setState({ isEmptyEmail: false });

      if (this.state.password !== "")
        this.setState({ isEmptyPassword: false });

      if (this.state.lastname !== "")
        this.setState({ isEmptyLastname: false });

      if (this.state.name !== "")
        this.setState({ isEmptyName: false });
    });
  };

  handleClickSignUp = () => {
    if (this.state.email === '')
      this.setState({ isEmptyEmail: true });

    if (this.state.password === '')
      this.setState({ isEmptyPassword: true });

    if (this.state.lastname === '')
      this.setState({ isEmptyLastname: true });

    if (this.state.name === '')
      this.setState({ isEmptyName: true });

    if (this.state.password !== '' && this.state.email !== '') {
      // do sign in and redirect to tickets
      let request = new Ajax('user/signup/', {
        method: 'POST',
        body: {
          email: this.state.email.toLowerCase(),
          password: this.state.password,
        }
      });
      console.log(request)
      request.result().then(() => {
        this.setState({success:true});
        return;
      }).catch(response=>{
        console.log(response);
      })
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
          <Typography component="h1" variant="h5" className={classes.typography}>
            Registrate
        </Typography>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Nombres"
                autoFocus
                error={this.state.isEmptyName}
                value={this.state.name}
                onChange={this.handleChange('name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Apellidos"
                name="lastName"
                autoComplete="lname"
                error={this.state.isEmptyLastname}
                value={this.state.lastname}
                onChange={this.handleChange('lastname')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                error={this.state.isEmptyEmail}
                value={this.state.email}
                onChange={this.handleChange('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                error={this.state.isEmptyPassword}
                value={this.state.password}
                onChange={this.handleChange('password')}
              />
            </Grid>
          </Grid>
          {
            this.state.success &&
            <Typography component="h1" variant="h5" className={classes.typography}>
              Registro Exitoso
            </Typography>
          }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.handleClickSignUp}
          >
            Registrar
          </Button>
          <Grid container justify="flex-start">
            <Grid item>
              <Link href="/" variant="body2">
                Ya tienes una cuenta? Inicia sesion
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
} export default withStyles(styles)(SignUp);
