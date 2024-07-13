import React, { useState, useEffect } from 'react'
import { View, Text,  Modal } from 'react-native'
import BrutalButton from './BrutalButton'
import { TimerPicker } from 'react-native-timer-picker'
import { LinearGradient } from 'react-native-linear-gradient'


//TODO: Add the toggle buttons so you can set individually timeSet and timeLeft?
//When setting a timer we should account for the amount of time the app is used today


interface Timers {
  [key: string]: { timeLeft?: number; timeSet?: number }
}

type Props = {
  name: string
  packageName: string
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  setTimers: React.Dispatch<React.SetStateAction<Timers>> //also updates the local storage automatically
  timers: Timers
}

export function ModalSetTimer(props: Props) {
  const [timeLimit, setTimeLimit] = useState<number>(0)
  const [pop, setPop] = useState<boolean>(false)
  const [isFiveMinDisabled, setIsFiveMinDisabled] = useState(true)
  const [addFiveMinutes, setAddFiveMinutes] = useState(false)
  const [change, setChange] = useState(false)



  useEffect(() => {
    console.log('test')
    const initialValue = props.timers[props.packageName]?.timeLeft
    setTimeLimit(props.timers[props.packageName]?.timeSet ?? 0)
    if (initialValue && initialValue < 60) {
      setIsFiveMinDisabled(false)
    }
  }, [])


  useEffect(() => {
    if (props.timers[props.packageName]?.timeSet !== timeLimit) {
      setChange(true)
    }
  }, [timeLimit])



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



    let newTimers = {
      ...props.timers,
      [props.packageName]: {
        timeLeft: newTimeLeft + additionalTime,
        timeSet: timeLimit,
      },
    }

    if (timeLimit === 0) {
      delete newTimers[props.packageName]
    }

    props.setTimers(newTimers) 

    handleClose()
  }

  return (
    <Modal animationType="fade" transparent>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-xl w-fit border-2 border-black items-center justify-center p-4" style={{gap:20}}>
          <View className='flex items-center'>
            <Text className="text-lg text-black font-[Lexend-Medium]">Timer for: {props.name}</Text>
            <Text className="text-sm text-black font-[Lexend-Medium]">Timer set: {props.timers[props.packageName]?.timeSet}s</Text>
            <Text className="text-sm text-black font-[Lexend-Medium]">Time left: {props.timers[props.packageName]?.timeLeft}s</Text>
            <View className='w-[295] pt-4 '>
              {/*<BrutalButton*/}
              {/*  disabled={isFiveMinDisabled}*/}
              {/*  onPress={addFiveMinutesClick}*/}
              {/*  text="Extend 5 minutes"*/}
              {/*  color='#FDF298'*/}
              {/*  iconName="plus-circle-outline"*/}
              {/*/>*/}
            </View>
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

          <View className="flex-row" style={{gap:8}}>
            <View className='w-40'>
              <BrutalButton
                onPress={handleClose}
                text="Close"
                color="#FF6B6B"
                iconName="close-circle-outline" />
            </View>
            <View className='w-40'>
              <BrutalButton disabled={!change} onPress={onConfirm} text="Confirm" iconName="timer-sand" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
