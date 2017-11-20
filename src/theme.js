import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {grey600} from 'material-ui/styles/colors';

export const MuiTheme = getMuiTheme({
  palette: {
    textColor: '#fff',
    alternateTextColor: '#000',
    primary1Color: '#0d2f35',
    accent1Color: '#c9ba9d',
    disabledColor: grey600,
    canvasColor: '#0d2f35',
  },
  appBar: {
    height: 50,
  },
});