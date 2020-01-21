import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Root} from 'native-base';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider} from 'react-redux';
import store from './src/public/redux/store';
// screens
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Splash from './src/screens/Splash';
import ChatRoom from './src/screens/ChatRoom';
import Map from './src/components/Map';
import DetailProfile from './src/components/DetailProfile';
import Forgot from './src/screens/Forgot';

const AppNavigator = createStackNavigator(
  {
    Splash: {
      screen: Splash,
    },
    Login: {
      screen: Login,
    },
    Home: {
      screen: Home,
    },
    Register: {
      screen: Register,
    },
    Profile: {
      screen: Profile,
    },
    ChatRoom: {
      screen: ChatRoom,
    },
    Map: {
      screen: Map,
    },
    DetailProfile: {
      screen: DetailProfile,
    },
    Forgot: {
      screen: Forgot,
    },
  },
  {
    unmountInactiveRoutes: true,
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return (
      <MenuProvider>
        <Provider store={store}>
          <Root>
            <AppContainer />
          </Root>
        </Provider>
      </MenuProvider>
    );
  }
}
