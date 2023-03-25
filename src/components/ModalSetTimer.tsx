import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
// interface Timers {
//   [key: string]: string;
// }
import InputFiled from '../components/InputFiledElement';
import BrutalButton from './BrutalButton';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Timers {
  [key: string]: {timeLeft?: number; timeSet?: number};
}

type Props = {
  name: string;
  packageName: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTimers: React.Dispatch<React.SetStateAction<Timers>>;
  timers: Timers;
};
const storeData = async (timers: Timers) => {
  try {
    await AsyncStorage.setItem('@local', JSON.stringify(timers));
    console.log('[storeData]: timers saved to storage.');
  } catch (e) {
    console.log('error saving timers to storage; Details:', e);
  }
};

export function ModalSetTimer(props: Props) {
  const [timeLimit, setTimeLimit] = useState<string>('');
  const [pop, setPop] = useState<boolean>(false);
  // usage limit timer in minutes
  //const [timers, setTimers] = useState<Timers>({});
  function handleClose() {
    setTimeLimit('');

    setTimeout(function () {
      props.setVisible(false);
    }, 250);
  }

  useEffect(() => {
    if (Object.keys(props.timers).length !== 0) {
      console.log('[useEffect Modal]: Setting local data... ');
      storeData(props.timers);
    }
  }, [props.timers]);

  function setButton() {
    setPop(false);
    setTimeLimit(timeLimit);
    props.setTimers({
      ...props.timers,
      [props.packageName]: {
        timeLeft: Number(timeLimit),
        timeSet: Number(timeLimit),
      },

      // set the initial timer value to the item's usageDuration
    });

    // props.setTimers2([
    //   ...props.timers2,
    //   {
    //     packageName: props.packageName,
    //     timeSet: parseInt(timeLimit),
    //     timeLeft: parseInt(timeLimit),
    //   },
    // ]);
    // storeData(props.timers);

    handleClose();
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
            }}>
            Timer for{' '}
            <Text
              style={{
                fontFamily: 'Lexend-SemiBold',
                color: 'black',
              }}>
              {props.name}
            </Text>
          </Text>

          <View style={styles.modalInpuit}>
            {/* <TextInput
              style={styles.input}
              onChangeText={setTimeLimit}
              value={timeLimit}
              keyboardType="numeric"
            /> */}
            <InputFiled
              placeholder=""
              value={timeLimit}
              setValue={setTimeLimit}
              pop={pop}
              numeric={true}
            />
            <Text
              style={{
                fontFamily: 'Lexend-SemiBold',
                fontSize: 18,
                paddingLeft: 5,
                color: 'black',
              }}>
              Seconds
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <BrutalButton
              onPress={handleClose}
              text="Close"
              color="#FF6B6B"
              iconName="close-circle-outline"
            />
            <BrutalButton
              onPress={setButton}
              text="Set"
              iconName="timer-sand"
            />

            {/* <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                setButton();
                setPop(true);
              }}>
              <Text style={styles.textStyle}>Set</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleClose()}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
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
  modalInpuit: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
