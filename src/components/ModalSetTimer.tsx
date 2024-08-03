import React from 'react'
import { View, Text, } from 'react-native'
import { TimerPicker } from 'react-native-timer-picker'
import { LinearGradient } from 'react-native-linear-gradient'

type Props = {
  name: string
  timeLimit: number
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>
}

export function ModalSetTimer(props: Props) {

  function handleDurationChange (duration: { hours: number, minutes: number, seconds: number }) {
    const totalSeconds = duration.minutes * 60 + duration.seconds
    props.setTimeLimit(totalSeconds)
  }

  return (
    <View>
      <View className='flex items-center'>
        <Text className="text-2xl text-black font-[Lexend-Medium]">Set App Timer</Text>
        <Text className="text-md text-black font-[Lexend-Medium]">for: {props.name}</Text>
      </View>
      <TimerPicker
        padWithNItems={2}
        hideHours
        minuteLabel="min"
        secondLabel="sec"
        LinearGradient={LinearGradient}
        initialValue={{ minutes: Math.floor(props.timeLimit / 60), seconds: props.timeLimit % 60 }}
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
    </View>
  )
}
