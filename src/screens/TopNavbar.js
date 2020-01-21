import React, {Component} from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Map from './TabMap';
import Chat from './TabChat';

const TopNavbar = createMaterialTopTabNavigator(
  {
    Chat: {
      screen: Chat,
      navigationOptions: {
        tabBarLabel: 'Chat',
        tabBarIcon: ({focused}) => (
          <Icon
            name="home"
            size={20}
            color={!focused ? '#979A9A' : '#42B549'}
          />
        ),
      },
    },
    Map: {
      screen: Map,
      navigationOptions: {
        tabBarLabel: 'Map',
        tabBarIcon: ({focused}) => (
          <Icon
            name="heart"
            size={20}
            color={!focused ? '#979A9A' : '#42B549'}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'Chat',
    activeColor: '#42B549',
    inactiveColor: '#979A9A',
    barStyle: {backgroundColor: '#fff'},
  },
);

export default TopNavbar;
