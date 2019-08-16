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
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';
import { red } from '@material-ui/core/colors';



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


class BodyAdminTickets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: null,
      open: false,
      title: '',
      description: '',
      status: '',
      ticketIdSelected: null
    }
    this.isLoading = false;
    this.openDialog = this.openDialog.bind(this);
    this.onClickUpdateTicket = this.onClickUpdateTicket.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);

  }
  componentDidMount() {
    // console.log(this.props.logedUser)
    this.ajaxRequestTickets();
  }

  componentDidUpdate(prevProps){
    console.log(this.props.logedUser)
    // console.log(this.props.reducer)
    if(this.props.logedUser){
      if(!this.state.rows)
        this.ajaxRequestTickets();
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  ajaxRequestTickets() {
    if (!this.isLoading && this.props.logedUser) {
      this.isLoading = true;
      this.request = new Ajax(`get-all-tickets`);
      this.request.result().then(response => {
        this.isLoading=false;
        this.setState({
          rows: response.data,
        }, () => {
        })
      }).catch(err => {
        console.log(err + 'ajax err')
      });
    }
  }

  openDialog() {
    this.setState({ open: true });
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

  onClickDialog=(row)=>{
    console.log(row)
    this.setState({
      title: row.title,
      description: row.description,
      status: row.status,
      ticketIdSelected: row.id,
      open: true,
    });
  }

  onClickUpdateTicket(){
    if (!this.isLoading) {
      this.isLoading = true;
      this.request = new Ajax(`update-ticket/${this.state.ticketIdSelected}`, {
        method: 'POST',
        body: {
          title: this.state.title,
          description: this.state.description,
          status: this.state.status,
        }
      });
      this.request.result().then(response => {
        this.isLoading = false;
        this.setState({open:false});
        this.ajaxRequestTickets();
      }).catch(err => {
        console.log(err + 'ajax err')
      });
    }
  }

  onClickDelete(){
    if (!this.isLoading) {
      this.isLoading = true;
      this.request = new Ajax(`delete/${this.state.ticketIdSelected}`, {
        method: 'DELETE'
      });
      this.request.result().then(response => {
        this.isLoading = false;
        this.setState({open:false});
        this.ajaxRequestTickets();
      }).catch(err => {
        console.log(err + 'ajax err')
      });
    }
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
          <DialogTitle id="responsive-dialog-title">{"Edite informacion de la solicitud"}</DialogTitle>
          <DialogContent>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Titulo"
              name="title"
              // error={this.state.isEmailEmpty}
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              select
              fullWidth
              id="status"
              label="status"
              name="status"
              onChange={this.handleChange('status')}
              value={this.state.status}>
                <MenuItem key={1} value={'En espera'}>
                  En espera
                </MenuItem>
                <MenuItem key={2} value={'Atendiendo'}>
                  Atendiendo
                </MenuItem>
                <MenuItem key={3} value={'Finalizado'}>
                  Finalizado
                </MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClickDelete} align="left" disabled={this.isLoading}>
              Eliminar Ticket
            </Button>
            <Button onClick={this.handleClose} color="primary" disabled={this.isLoading}>
              Cancelar
            </Button>
            <Button onClick={this.onClickUpdateTicket} color="primary" autoFocus disabled={this.isLoading}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Ticket ID</TableCell>
                <TableCell align="left">User ID</TableCell>
                <TableCell>Titulo</TableCell>
                <TableCell >Descripcion</TableCell>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.rows &&
                this.state.rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.user_id}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.created_at}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="Delete" 
                      className={classes.margin} 
                      onClick={()=>this.onClickDialog(row)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
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
  }), {})(withStyles(styles)(BodyAdminTickets));