import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import InputFiled from '../components/InputFiledElement'
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
  const [showPicker, setShowPicker] = useState(false)
  const [alarmString, setAlarmString] = useState<string | null>(null)
  const [timeLimit, setTimeLimit] = useState<number>(0)
  const [pop, setPop] = useState<boolean>(false)
  const [date, setDate] = useState(new Date())
  const [selectedLanguage, setSelectedLanguage] = useState()

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
    <Modal animationType="fade" visible={props.visible} transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalChildren}>
          <Text
            style={{
              fontFamily: 'Lexend-SemiBold',
              fontSize: 20,
              color: 'black',
            }}
          >
              Timer for{' '}
            <Text
              style={{
                fontFamily: 'Lexend-SemiBold',
                color: 'black',
              }}
            >
              {props.name}
            </Text>
          </Text>
          <TimerPicker
            padWithNItems={2}
            hideHours
            minuteLabel="min"
            secondLabel="sec"
            LinearGradient={LinearGradient}
            initialValue={{minutes: Math.floor(timeLimit / 60), seconds: timeLimit % 60}}
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

          <View style={{ width: 265 }}>
            <BrutalButton
              disabled={ initialTimerValueSet }
              onPress={ addFiveMinutes }
              text="Add 5 min to time left"
              iconName="plus-circle-outline"
            />
          </View>

          <View style={styles.modalButtons}>
            <View style={{ width: 120 }}>
              <BrutalButton
                onPress={handleClose}
                text="Close"
                color="#FF6B6B"
                iconName="close-circle-outline"
              />
            </View>
            <View style={{ width: 140 }}>
              <BrutalButton disabled={timeLimit === undefined} onPress={setButton} text="Confirm" iconName="timer-sand" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000063',
  },
  modalChildren: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  button: {
    borderRadius: 7,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#315461',
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalInput: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})
