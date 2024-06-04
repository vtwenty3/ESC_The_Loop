import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Vibration } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
  onPress: () => void
  text?: string
  color?: string      
  iconName?: string
  iconColor?: string
  iconSize?: number
  rotate?: boolean
  getStuck?: boolean 
}
export default function BrutalButton(props: Props) {
  const [isPressed, setIsPressed] = useState(false)

  const animatedValueTask = useRef(new Animated.Value(isPressed ? 0 : -4)).current

  const rotationValue = useRef(new Animated.Value(0)).current

  const startRotationAnimation = useCallback(() => {
    rotationValue.setValue(0)
    Animated.timing(rotationValue, {
      toValue: 1,
      duration: 3400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        startRotationAnimation()
      }
    })
  }, [])

  useEffect(() => {
    if (props.rotate === true) {
      startRotationAnimation()
    } else {
      rotationValue.stopAnimation()
    }
  }, [props.rotate, startRotationAnimation])

  useEffect(() => {
    if (props.getStuck === true) {
      handlePressIn()
    } else {
      handlePressOut()
    }
  }, [props.getStuck])

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  })

  const handlePressIn = () => {
    Vibration.vibrate(10)
    setIsPressed(true)
    Animated.spring(animatedValueTask, {
      toValue: 0,
      stiffness: 170,
      damping: 6.7,
      mass: 0.2,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    setIsPressed(false)
    Animated.spring(animatedValueTask, {
      toValue: -4,
      stiffness: 270,
      damping: 3.7,
      mass: 0.4,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start()
  }
  return (
    <TouchableOpacity
      style={styles.buttonRoot}
      activeOpacity={1}
      onPress={props.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.buttonShadow}>
        <Animated.View
          style={{
            transform: [{ translateX: animatedValueTask }, { translateY: animatedValueTask }],
          }}
        >
          <View style={[styles.button, { backgroundColor: props.color ? props.color : '#7FBC8C' }]}>
            <Animated.View
              style={[{ transform: [{ rotate: rotation }] }, { padding: props.text ? 0 : 10 }]}
            >
              <Icon
                name={props.iconName ? props.iconName : 'check'}
                size={props.iconSize ? props.iconSize : 25}
                color={props.iconColor ? props.iconColor : 'black'}
              />
            </Animated.View>
            {props.text ? <Text style={styles.text}>{props.text}</Text> : null}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonRoot: {
    marginLeft: 6
  },
  buttonShadow: {
    borderRadius: 10,
    backgroundColor: 'black',
    width: '100%',
  },
  text: {
    color: 'black',
    fontFamily: 'Lexend-Regular',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    zIndex: 3,
    borderRadius: 10,
    backgroundColor: '#7FBC8C',
  },
})
