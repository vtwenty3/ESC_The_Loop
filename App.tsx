import React, {useState, useEffect} from 'react';
import {StyleSheet, NativeModules} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Tasks} from './src/screens/Tasks';
import {Notes} from './src/screens/Notes';
import {Settings} from './src/screens/Settings';
import {Usage} from './src/screens/Usage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();
function App(): JSX.Element {
  const MyTheme = {
    dark: false,
    colors: {
      primary: 'yellow',
      background: '#20232a',
      card: '#60232a',
      text: 'white',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };
  const linking = {
    prefixes: ['escapetheloop://'],
    config: {
      screens: {
        Tasks: 'tasks',
      },
    },
  };
  return (
    <NavigationContainer theme={MyTheme} linking={linking}>
      <Tab.Navigator
        initialRouteName="Usage"
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
          headerShown: false,
        }}>
        <Tab.Screen
          name="Usage"
          component={Usage}
          options={{
            tabBarLabel: 'Usage',
            lazy: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="chart-donut" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Tasks"
          component={Tasks}
          options={{
            tabBarLabel: 'Tasks',
            tabBarIcon: ({color, size}) => (
              <Icon
                name="checkbox-marked-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notes"
          component={Notes}
          options={{
            tabBarLabel: 'Notes',
            tabBarIcon: ({color, size}) => (
              <Icon name="circle-edit-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color, size}) => (
              <Icon
                name="dots-vertical-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;
