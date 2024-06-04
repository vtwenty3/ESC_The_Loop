import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import InputFiled from '../components/InputFiledElement'
import BrutalButton from './BrutalButton'

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
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined)
  const [pop, setPop] = useState<boolean>(false)

  const [initialTimerValueSet, setInitialTimerValueSet] = useState(false)

  useEffect(() => {
    const initialValue = props.timers[props.packageName]?.timeSet
    setTimeLimit(initialValue)
    setInitialTimerValueSet(initialValue !== undefined)
  }, [props.visible, props.packageName, props.timers])

  function addFiveMinutes() {
    if (timeLimit !== undefined) {
      setTimeLimit(timeLimit + 300)
      props.setTimers({
        ...props.timers,
        [props.packageName]: {
          timeLeft: (props.timers[props.packageName]?.timeLeft || 0) + 300,
          timeSet: timeLimit + 300,
        },
      })
    }
  }

  function handleClose() {
    setTimeLimit(undefined)
    setTimeout(() => {
      props.setVisible(false)
    }, 250)
  }



  async function setButton() {
    setPop(false)
    props.setTimers({
      ...props.timers,
      [props.packageName]: {
        timeLeft: timeLimit,
        timeSet: timeLimit,
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

          <View style={styles.modalInput}>
            <BrutalButton
              onPress={() => {
                const updatedTimers = { ...props.timers }
                delete updatedTimers[props.packageName]
                props.setTimers(updatedTimers)
                handleClose()
              }}
              color="#FF6B6B"
              iconName="delete-outline"
            />
            <InputFiled
              autofocus={true}
              placeholder=""
              value={timeLimit?.toString() ?? ''}
              setValue={(value) => setTimeLimit(Number(value))}
              pop={pop}
              numeric={true}
              editable={!initialTimerValueSet}
            />
            <Text
              style={{
                fontFamily: 'Lexend-SemiBold',
                fontSize: 18,
                paddingLeft: 5,
                color: 'black',
              }}
            >
                Seconds
            </Text>
          </View>
          <View>
            <BrutalButton
              disabled={timeLimit === undefined}
              onPress={addFiveMinutes}
              text="5 minutes"
              iconName="close-circle-outline"
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
            <View style={{ width: 120 }}>
              <BrutalButton disabled={timeLimit === undefined} onPress={setButton} text="Set" iconName="timer-sand" />
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
    gap: 20,
  },
  modalInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})
