import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Dimensions, StatusBar } from 'react-native'
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { Tasks } from './src/screens/TasksScreen' 
import { Notes } from './src/screens/NotesScreen'   
import { Settings } from './src/screens/SettingsScreen'
import { Usage } from './src/screens/UsageScreen'
import { Create } from './src/screens/CreateScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Note, Task } from './src/types'
const { width, height } = Dimensions.get('window')
const Tab = createBottomTabNavigator()
import * as localStorage from './src/services/LocalStorage'
import './global.css'
import { v4 as uuidv4 } from 'uuid'

function App()  {
  const [iconSize] = useState(37)
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
  }
  const linking = {
    prefixes: ['escapetheloop://'],
    config: {
      screens: {
        Tasks: 'tasks',
      },
    },
  }

  async function Init() {
    const note: Note = {
      title: 'Im a sample note!',
      description: 'Click me to edit or delete me.',
      type: 'Note',
      tags: '',
      complete: false,
      timestamp: new Date().toISOString(),
      key: uuidv4()
    }
    const task1: Task = {
      title: 'I\'m a sample task!',
      description: '',
      type: 'Task',
      tags: '',
      complete: false,
      timestamp: new Date().toISOString(),
      key: uuidv4()
    }
    const task2: Task = {
      title: 'Mark me as complete...',
      description: '',
      type: 'Task',
      tags: '',
      complete: false,
      timestamp: new Date().toISOString(),
      key: uuidv4()

    }
    const task3 : Task = {
      title: '...or click me to edit!',
      description: '',
      type: 'Task',
      tags: '',
      complete: false,
      timestamp: new Date().toISOString(),
      key: uuidv4()
    }

    await localStorage.setDataByKey('@local_notes' , [note] )
    await localStorage.setDataByKey('@local_tasks' , [task1, task2, task3] )
  }

  useEffect(() => {
    // check if the flag exists in AsyncStorage
    const checkFlag = async () => {
      const isFlagSet = await AsyncStorage.getItem('myFlag')

      if (isFlagSet === null) {
        // the flag is not set, perform the action here
        await Init()
        // set the flag in AsyncStorage
        await AsyncStorage.setItem('myFlag', 'true')
      } else {
        // the flag is set, the action has already been performed
        console.log('Action already performed')
      }
    }

    checkFlag()
  }, [])

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
              tabBarIcon: ({color}) => (
                <Icon name="chart-donut" size={iconSize} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Tasks"
            component={Tasks}
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: ({color}) => (
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
              tabBarIcon: () => (
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

              tabBarIcon: ({color}) => (
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
              tabBarIcon: ({color}) => (
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
  )
}
export default App


