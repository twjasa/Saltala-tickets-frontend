import React, { Component } from 'react';
import './App.css';
import Site from './components/Site';
import theme from './configs/materialTheme';
import { MuiThemeProvider} from '@material-ui/core/styles';
// react routes imports
import { BrowserRouter } from 'react-router-dom';
// redux store
import { Provider } from 'react-redux';
import initiateStore from './redux/configStore';

// initializate the store creation
const store = initiateStore();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <BrowserRouter>
                <Site />
            </BrowserRouter>
          </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
