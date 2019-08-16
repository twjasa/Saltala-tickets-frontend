import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../assets/css/SiteSignIn.css'
import Ajax from '../util/Ajax';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';



const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  button: {
    backgroundColor: '#2196f3',
    marginTop: theme.spacing.unit * 3,
  },
});


class BodyTickets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: null,
      open: false,
      title: '',
      description: '',
    }
    this.isLoading = false;
    this.openDialog = this.openDialog.bind(this);
    this.onClickNewTicket = this.onClickNewTicket.bind(this);

  }
  componentDidMount() {
    console.log(this.props.logedUser)
    this.ajaxRequestTickets();
  }

  componentDidUpdate(){
    console.log(this.props.reducer)
    if(this.props.logedUser){
      this.ajaxRequestTickets();
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  ajaxRequestTickets() {
    if (!this.isLoading && this.props.logedUser) {
      this.isLoading = true;
      this.request = new Ajax(`get-user-tickets/${this.props.logedUser.id}`);
      this.request.result().then(response => {
        this.setState({
          rows: response.data,
        }, () => {
          this.isLoading = false;
          console.log(this.state.rows);
        })
      }).catch(err => {
        console.log(err + 'ajax err')
      });
    }
  }

  ajaxRequestPostTicket() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.request = new Ajax(`new-ticket/${this.props.logedUser.id}`, {
        method: 'POST',
        body: {
          title: this.state.title,
          description: this.state.description,
          status: 'En espera',
        }
      });
      this.request.result().then(response => {
        this.isLoading = false;
        this.setState({ title: '', description: '', open: false },()=>{
          this.ajaxRequestTickets();
        });
        console.log(response)
      });
    }
  }

  openDialog() {
    this.setState({ open: true });
  }

  onClickNewTicket() {
    if (this.state.description !== '' && this.state.title !== '')
      this.ajaxRequestPostTicket();
  }

  componentWillUnmount() {
    if (this.request) {
      this.request.abort();
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    const { fullScreen } = this.props
    return (
      <div className="tickets-container">
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Ingrese informacion de su solicitud"}</DialogTitle>
          <DialogContent>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Titulo"
              name="title"
              error={this.state.isEmailEmpty}
              autoFocus
              onChange={this.handleChange('title')}
              value={this.state.title}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Descripcion"
              name="description"
              multiline
              rows="4"
              onChange={this.handleChange('description')}
              value={this.state.description}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" disabled={this.isLoading}>
              Cancelar
            </Button>
            <Button onClick={this.onClickNewTicket} color="primary" autoFocus disabled={this.isLoading}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            className={classes.button}
            onClick={this.openDialog}>
            Solicitar Ticket
        </Button>
        </label>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Titulo</TableCell>
                <TableCell >Descripcion</TableCell>
                <TableCell align="right">Fecha/Hora</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.rows &&
                this.state.rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">{row.created_at}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
} export default connect(
  state => ({
    reducer: state.authReducer,
    logedUser: state.authReducer.logedUser,
    tokenFromApi: state.authReducer.successfulRequest
  }), {})(withStyles(styles)(BodyTickets));