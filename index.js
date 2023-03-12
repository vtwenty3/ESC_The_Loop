/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {ModalExpired} from './components/ModalExpired';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('ReactModal', () => ModalExpired);
