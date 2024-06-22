import React, { useState, useEffect } from 'react'
import { View, Text,  Modal } from 'react-native'
import BrutalButton from './BrutalButton'
import { TimerPicker } from 'react-native-timer-picker'
import { LinearGradient } from 'react-native-linear-gradient'


//TODO: Add the toggle buttons so you can set individually timeSet and timeLeft?

interface Timers {
  [key: string]: { timeLeft?: number; timeSet?: number }
}

type Props = {
  name: string
  packageName: string
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  setTimers: React.Dispatch<React.SetStateAction<Timers>>
  timers: Timers
}

export function ModalSetTimer(props: Props) {
  const [timeLimit, setTimeLimit] = useState<number>(0)
  const [pop, setPop] = useState<boolean>(false)
  const [isFiveMinDisabled, setIsFiveMinDisabled] = useState(true)
  const [addFiveMinutes, setAddFiveMinutes] = useState(false)



  useEffect(() => {
    const initialValue = props.timers[props.packageName]?.timeSet
    setTimeLimit(props.timers[props.packageName]?.timeSet ?? 0)
    if (initialValue && initialValue < 60) {
      setIsFiveMinDisabled(false)
    }
  }, [props.visible, props.packageName, props.timers])

  function addFiveMinutesClick() {
    setAddFiveMinutes(true)
  }

  function handleClose() {
    setTimeLimit(0)
    setTimeout(() => {
      props.setVisible(false)
    }, 250)
  }

  function handleDurationChange (duration: { hours: number, minutes: number, seconds: number }) {
    const totalSeconds = duration.minutes * 60 + duration.seconds
    setTimeLimit(totalSeconds)
  }


  async function onConfirm() {
    setPop(false)
    const currentTimeLeft = props.timers[props.packageName]?.timeLeft
    const newTimeLeft = currentTimeLeft !== undefined ? currentTimeLeft : timeLimit
    const additionalTime = addFiveMinutes ? 300 : 0

    props.setTimers({
      ...props.timers,
      [props.packageName]: {
        timeLeft: newTimeLeft + additionalTime,
        timeSet: timeLimit,
      },
    })
    handleClose()
  }

  return (
    <Modal animationType="fade" visible={props.visible} transparent>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-lg pb-4 px-4 border-2 border-black items-center justify-center gap-y-5">
          <View className='flex items-center pb-2'>
            <Text className="text-lg text-black font-[Lexend-Medium]">{props.name}</Text>
            <Text className="text-sm text-black font-[Lexend-Medium]">Timer set: {props.timers[props.packageName]?.timeSet}s</Text>
            <Text className="text-sm text-black font-[Lexend-Medium]">Time left: {props.timers[props.packageName]?.timeLeft}s</Text>
          </View>
          <TimerPicker
            padWithNItems={2}
            hideHours
            minuteLabel="min"
            secondLabel="sec"
            LinearGradient={LinearGradient}
            initialValue={{ minutes: Math.floor(timeLimit / 60), seconds: timeLimit % 60 }}
            onDurationChange={(duration) => handleDurationChange(duration)}
            styles={{
              theme: 'light',
              backgroundColor: '#FFFFFF',
              pickerItem: {
                fontSize: 24,
              },
              pickerLabel: {
                fontSize: 20,
                right: -20,
              },
              pickerLabelContainer: {
                width: 40,
              },
              pickerItemContainer: {
                width: 120,
              },
            }}
          />
          <View className="w-[270]">
            <BrutalButton
              disabled={isFiveMinDisabled}
              onPress={addFiveMinutesClick}
              text="5 mins to time left"
              color='#FDF298'
              iconName="plus-circle-outline"
            />
          </View>
          <View className="flex-row">
            <View className='w-32 mr-2'>
              <BrutalButton
                onPress={handleClose}
                text="Close"
                color="#FF6B6B"
                iconName="close-circle-outline" />
            </View>
            <BrutalButton disabled={timeLimit === undefined} onPress={onConfirm} text="Confirm" iconName="timer-sand" />
          </View>
        </View>
      </View>
    </Modal>
  )
}
