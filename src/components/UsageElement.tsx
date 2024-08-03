import { Text, View, TouchableOpacity, Animated, Image, Vibration } from 'react-native'
import React, { useRef, useState } from 'react'
import BrutalButton from './BrutalButton'
import { CustomModal }  from './Modal'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useFormatTime from '../hooks/useFormatTime'
import { ModalSetTimer } from './ModalSetTimer'

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
  timers: Timers
  setTimers: React.Dispatch<React.SetStateAction<Timers>>
}
export default React.memo(function UsageElement(props: Props) {

  const shadow = -5
  const [isPressed, setIsPressed] = useState(false)
  const animatedValueTask = useRef(new Animated.Value(isPressed ? 0 : shadow)).current
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalVisibleTimer, setIsModalVisibleTimer] = useState(false)
  const [timeLimit, setTimeLimit] = useState<number>(props.timer?.timeSet ?? 0)


  const calculateUsagePercentage = () => {
    const timeLeft = props.timer?.timeLeft || 0
    const timeSet = props.timer?.timeSet || 0
    const percentage = 100 - Math.round((timeLeft / timeSet) * 100) || 0
    return 100 - percentage
  }


  const handlePressIn = async () => {
    // props.onOpenModal(props.item.appName, props.item.packageName)
    Animated.spring(animatedValueTask, {
      toValue: 0,
      stiffness: 70,
      damping: 6.7,
      mass: 0.2,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start()
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


  function handleModalOpenTimer () {
    // handlePressIn()
    setIsModalVisibleTimer(true)
  }

  async function handleModalOpen () {
    handlePressIn()
    setTimeout(() => {
      setIsModalVisible(true)
    }, 100)
  }


  function handleModalClose () {
    setIsModalVisible(false)
    setIsModalVisibleTimer(false)
    handlePressOut()
  }



  //TODO: Make sure that the state of the usageTime updates as now it doesn't
  const  handleConfirmModalTimer = async () => {
    if (props.timers){
      const newTimers = {
        ...props.timers,
        [props.item.packageName]: {
          ...props.timers[props.item.packageName],
          timeLeft: (props.timers[props.item.packageName]?.timeLeft || 0) + 300,
        },
      }
      props.setTimers(newTimers)
    }
    setIsModalVisibleTimer(false)
  }

  const  handleConfirmModal = async () => {

    const currentTimeLeft = props.timer?.timeLeft
    const newTimeLeft = currentTimeLeft !== undefined ? currentTimeLeft : timeLimit
    const newTimers = {
      ...props.timers,
      [props.item.packageName]: {
        timeLeft: newTimeLeft,
        timeSet: timeLimit,
      },
    }
  
    if (timeLimit === 0) {
      delete newTimers[props.item.packageName]
    }
  
    props.setTimers(newTimers) 
    setIsModalVisible(false)
    handlePressOut()
  }

 
  return (
    <View className='flex flex-row w-[95%] mx-auto gap-1 max-h-[75]' style={[ { paddingTop: -shadow, paddingLeft: -shadow }]}>
      <TouchableOpacity
        className='flex-1'
        activeOpacity={1}
        onPress={handleModalOpen}
      >
        <View className='flex items-center h-full bg-black rounded-xl'  >
          <Animated.View
            className='z-20 flex flex-row items-center h-full p-2 bg-yellow-100 border-2 border-black rounded-xl'
            style={[{ gap: 8, transform: [{ translateX: animatedValueTask }, { translateY: animatedValueTask }]}]}>
            <View className='border-2 border-black rounded-full w-14 h-14'>
              <Image className='w-full h-full'
                source={{ uri: `data:image/png;base64,${props.item.iconBase64}` }}/>
            </View>

            <View className='flex flex-col flex-grow'>
              <View className='flex flex-row justify-between'>
                <Text className='font-lexend-semi-bold text-[16px] text-black pb-1' >{props.item.appName}</Text>


              </View>
              <View className='w-full overflow-hidden border-2 border-black rounded-lg h-7'>
                <View className='w-full h-full bg-red-400'>
                  <View className='absolute z-10 flex font-lexend flex-row items-center justify-between pb-px w-full h-full px-1.5'>
                    <Text className='text-black text-15 font-lexend' >Used: {useFormatTime(props.item.usageTimeSeconds)}</Text>
                    {props.timer?.timeLeft !== undefined &&
                      ( <Text className='text-black text-15 font-lexend '>
                        Left: {useFormatTime(props.timers[props.item.packageName].timeLeft)}
                        {/*{useFormatTime(props.timer?.timeSet)}*/}
                      </Text> )}
                  </View>
                  <View className='w-full h-full bg-pink-200' style={{ width: `${calculateUsagePercentage()}%` }} />
                </View>
              </View>
            </View>

          </Animated.View>

        </View>
      </TouchableOpacity>
      {props.timer?.timeLeft !== undefined && (
        <View className='h-full'>
          <BrutalButton
            fullHeight
            iconName="timer-sand"
            color="#4ade80"
            onPress={handleModalOpenTimer}
          />
        </View>
      )}
      <CustomModal visible={isModalVisibleTimer} onClose={handleModalClose} onConfirm={handleConfirmModalTimer} >
        <Icon
          name='timer-sand'
          size={100}
          color="black"
        />
        <Text className="text-2xl text-black font-[Lexend-Medium]">Need More Time?</Text>
        <Text className="text-md text-black font-[Lexend-Regular]">This will grant you an <Text className='font-[Lexend-Bold]'>extra 5 minutes</Text> for today only, and won't alter your set daily time."</Text>
      </CustomModal>
  
      <CustomModal visible={isModalVisible} onClose={handleModalClose} onConfirm={handleConfirmModal} >
        <ModalSetTimer
          name={props.item.packageName}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
        />
      </CustomModal>

    </View>
  )
})
