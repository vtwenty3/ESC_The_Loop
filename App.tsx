import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  NativeModules,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Tasks} from './src/screens/Tasks';
import {Notes} from './src/screens/Notes';
import {Settings} from './src/screens/Settings';
import {Usage} from './src/screens/Usage';
import {Create} from './src/screens/Create';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  const [iconSize, setIconSize] = useState(37);
  const MyTheme = {
    dark: false,
    colors: {
      primary: 'black',
      background: '#FBF4E7',
      card: '#E8E0D1',
      text: '#000000',
      border: 'black',
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
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {height: 70},
        }}>
        <Tab.Screen
          name="Usage"
          component={Usage}
          options={{
            tabBarLabel: 'Usage',
            lazy: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="chart-donut" size={iconSize} color={color} />
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
                size={iconSize}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Create"
          component={Create}
          options={{
            tabBarLabel: 'Create',
            tabBarIcon: ({color, size}) => (
              <Icon
                style={{
                  backgroundColor: 'black',
                  borderRadius: 50,
                }}
                name="plus-circle"
                size={iconSize + 14}
                color={'#FDF2AD'}
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
              <Icon name="circle-edit-outline" size={iconSize} color={color} />
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
                size={iconSize}
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    shadowColor: '#000',
    gap: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 7,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#315461',
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  modalInpuit: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
