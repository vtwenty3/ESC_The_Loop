import { StyleSheet, Text, View, TouchableOpacity, Animated, Image, Vibration } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
interface Timers {
  [key: string]: { timeLeft?: number; timeSet?: number }
}
type Props = {
  item: {
    packageName: string
    appName: string
    usageTimeSeconds: number
    usageTimeMinutes: number
    iconBase64: string
  }
  timer: { timeLeft?: number; timeSet?: number }
  modalVisible: boolean
  onOpenModal: (appName: string, packageName: string) => void
}
export default function UsageElement(props: Props) {
  const shadow = -5
  const [isPressed, setIsPressed] = useState(false)
  const animatedValueTask = useRef(new Animated.Value(isPressed ? 0 : shadow)).current

  const calculateUsagePercentage = () => {
    const timeLeft = props.timer?.timeLeft || 0
    const timeSet = props.timer?.timeSet || 0
    const percentage = 100 - Math.round((timeLeft / timeSet) * 100) || 0
    return 100 - percentage
  }

  useEffect(() => {
    if (!props.modalVisible && isPressed) {
      handlePressOut()
    }
  }, [props.modalVisible])

  const handlePressIn = async () => {
    Vibration.vibrate(11)
    setIsPressed(true)
    Animated.spring(animatedValueTask, {
      toValue: 0,
      stiffness: 70,
      damping: 6.7,
      mass: 0.2,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start(() => {
      props.onOpenModal(props.item.appName, props.item.packageName)
    })
  }


  const handlePressOut = () => {
    setIsPressed(false)
    setTimeout(() => {
      Vibration.vibrate(10)
    }, 800)
    Animated.spring(animatedValueTask, {
      toValue: shadow,
      delay: 650,
      stiffness: 470,
      damping: 15,
      mass: 1.5,
      restSpeedThreshold: 0.2,
      restDisplacementThreshold: 0.2,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View className=' w-11/12 mx-auto' style={[ { paddingTop: -shadow, paddingLeft: -shadow }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePressIn}
      >
        <View className='flex items-center bg-black rounded-xl' >
          <Animated.View
            className='flex flex-row items-center bg-yellow-100 rounded-xl border-2 border-black p-2 z-20'
            style={[{ gap: 8, transform: [{ translateX: animatedValueTask }, { translateY: animatedValueTask }]}]}>
            <View className='w-14 h-14 border-2 border-black rounded-full'>
              <Image className='w-full h-full'
                source={{ uri: `data:image/png;base64,${props.item.iconBase64}` }}/>
            </View>

            <View className='flex-grow flex flex-col'>
              <Text className='font-lexend-semi-bold text-[16px] text-black pb-1' >{props.item.appName}</Text>
              <View className='w-full h-7 border-2 border-black rounded-lg overflow-hidden'>
                <View className='bg-red-400 w-full h-full'>
                  <View className='absolute z-10 flex font-lexend flex-row justify-between items-center pb-px w-full h-full px-1.5'>
                    <Text className='text-15 text-black font-lexend' >Used: {props.item.usageTimeSeconds}s</Text>
                    {props.timer?.timeLeft === undefined ?
                      ('')
                      :
                      ( <Text className='text-15 text-black font-lexend'>
                        Left: {props.timer?.timeLeft}s/
                        {props.timer?.timeSet}s
                      </Text> )}
                  </View>
                  <View className='bg-pink-200 w-full h-full' style={{ width: `${calculateUsagePercentage()}%` }} />
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
