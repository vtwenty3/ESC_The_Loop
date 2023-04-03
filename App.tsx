import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, View, Dimensions, StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Tasks} from './src/screens/TasksScreen';
import {Notes} from './src/screens/NotesScreen';
import {Settings} from './src/screens/SettingsScreen';
import {Usage} from './src/screens/UsageScreen';
import {Create} from './src/screens/CreateScreen';

const {width, height} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  const [iconSize, setIconSize] = useState(37);
  // const radius = (iconSize + 14) / 2;
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
    <View
      style={{
        width,
        height,
      }}>
      <StatusBar backgroundColor={'#9723C9'} />

      <NavigationContainer theme={MyTheme} linking={linking}>
        <Tab.Navigator
          initialRouteName="Usage"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              height: '11%',
              borderTopWidth: 2,
            },
            tabBarVisibilityAnimationConfig: {
              hide: {
                animation: 'timing',
                config: {
                  duration: 600,
                },
              },
              show: {
                animation: 'timing',
                config: {
                  duration: 600,
                },
              },
            },
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
                    borderRadius: iconSize + 13 / 2,
                  }}
                  name="plus-circle"
                  size={iconSize + 13}
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
                <Icon
                  name="circle-edit-outline"
                  size={iconSize}
                  color={color}
                />
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
    </View>
  );
}
export default App;

const styles = StyleSheet.create({});
