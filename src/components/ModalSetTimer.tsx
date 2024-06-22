import React, { useState, useEffect } from 'react'
import { View, Text,  Modal } from 'react-native'
import BrutalButton from './BrutalButton'
import { TimerPicker } from 'react-native-timer-picker'
import { LinearGradient } from 'react-native-linear-gradient'
import {timeLeft} from '../services/Notifications' // or `import LinearGradient from "react-native-linear-gradient"`
import tw from 'twrnc'


//TODO: Picker cleanup, finish the implementation and delete the unused libraries

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
  const [initialTimerValueSet, setInitialTimerValueSet] = useState(false)



  useEffect(() => {
    const initialValue = props.timers[props.packageName]?.timeSet
    setTimeLimit(props.timers[props.packageName]?.timeSet ?? 0)
    setInitialTimerValueSet(initialValue !== 0)
  }, [props.visible, props.packageName, props.timers])

  function addFiveMinutes() {
    if (timeLimit !== undefined) {
      setTimeLimit(timeLimit + 300)
      props.setTimers({
        ...props.timers,
        [props.packageName]: {
          timeLeft: 300,
          ...props.timers[props.packageName],
        },
      })
    }
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


  async function setButton() {
    console.log()
    setPop(false)
    props.setTimers({
      ...props.timers,
      [props.packageName]: {
        ...props.timers[props.packageName],
        timeLeft: (props.timers[props.packageName]?.timeLeft || 0) + 300,
      },
    })
    handleClose()
  }

  return (
    <Modal animationType="fade" visible={props.visible} transparent>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-lg p-5 border-2 border-black items-center justify-center gap-y-5">
          <Text className="text-lg font-semibold text-black">
              Timer for{' '}
            <Text className="font-semibold text-black">{props.name}</Text>
          </Text>
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
          <View className="w-3/4">
            <BrutalButton
              disabled={initialTimerValueSet}
              onPress={addFiveMinutes}
              text="Add 5 min to time left"
              iconName="plus-circle-outline"
            />
          </View>
          <View className="flex-row gap-x-4">
            <View className="w-35">
              <BrutalButton
                onPress={handleClose}
                text="Close"
                color="#FF6B6B"
                iconName="close-circle-outline"
              />
            </View>
            <View className="w-35">
              <BrutalButton disabled={timeLimit === undefined} onPress={setButton} text="Confirm" iconName="timer-sand" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
