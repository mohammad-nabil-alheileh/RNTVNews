// Entry point for the web build (LG webOS). Android uses index.js.
import 'core-js/actual/object/has-own';
import 'core-js/actual/array/find-last';
import 'core-js/actual/array/find-last-index';
import { AppRegistry } from 'react-native';
import App from './src/App';
import appJson from './app.json';

const appName = appJson.name;

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
