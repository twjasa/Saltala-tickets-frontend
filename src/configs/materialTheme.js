import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary:{main: "#3b99fc"},
    secondary:{main: "#7cc04c"}
  },
  typography: { useNextVariants: true },
});
export default theme;
