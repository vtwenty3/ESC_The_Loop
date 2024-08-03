import { Text, View, TouchableOpacity, Animated, Easing, Vibration } from 'react-native'
import React, { useRef, useEffect, useCallback } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//TODO: If disabled background grey and popped in

type Props = {
  onPress?: () => void
  text?: string
  color?: string      
  iconName?: string
  iconColor?: string
  iconSize?: number
  rotate?: boolean
  getStuck?: boolean
  disabled?: boolean
  fullHeight?: boolean
}
export default function BrutalButton(props: Props = {disabled: false}) {
  // const [isPressed, setIsPressed] = useState(false)

  // const animatedValueTask = useRef(new Animated.Value(isPressed ? 0 : -4)).current
  const animatedValueTask = useRef(new Animated.Value(props.disabled ? 0 : -4)).current

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

  useEffect(() => {
    if (props.disabled == true) {
      handlePressIn()
    } else if (props.disabled === false) {
      handlePressOut()
    }
  }, [props.disabled])


  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  })

  const handlePressIn = () => {
    Vibration.vibrate(10)
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
      disabled={props.disabled}
      className='ml-1.5'
      activeOpacity={1}
      onPress={props.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View className='bg-black rounded-xl'>
        <Animated.View
          style={{
            transform: [{ translateX: animatedValueTask }, { translateY: animatedValueTask }],
          }}
        >
          <View className='flex flex-row items-center justify-center border-2 z-3 rounded-xl'
            style={[{ gap: 5, paddingVertical: props.text ? 10 : 0,  backgroundColor: props.disabled ? '#dbdbdb' : (props.color ? props.color : '#7FBC8C') }, {height: props.fullHeight ? '100%' : 'auto'}]}
          >
            <Animated.View
              style={[{ transform: [{ rotate: rotation }] }, { padding: props.text ? 0 : 10 }]}
            >
              <Icon
                name={props.iconName ? props.iconName : 'check'}
                size={props.iconSize ? props.iconSize : 25}
                color={props.iconColor ? props.iconColor : 'black'}
              />
            </Animated.View>
            {props.text ? <Text style={{ color: props.disabled ? '#3a3a3a' : 'black' }} className='font-[Lexend-Regular] text-xl text-center'>{props.text}</Text> : null}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}
