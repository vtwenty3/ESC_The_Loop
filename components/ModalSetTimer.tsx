import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
type Props = {
  name: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ModalSetTimer(props: Props) {
  const [timeLimit, setTimeLimit] = useState<string>(''); // usage limit timer in minutes
  const [number, onChangeNumber] = useState<string>('');

  interface Timers {
    [key: string]: string;
  }
  const [timers, setTimers] = useState<Timers>({});
  function handleClose() {
    props.setVisible(false);
    setTimeLimit('');
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        visible={props.visible}
        transparent={true}
        onRequestClose={() => {
          handleClose();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Set a timer for {props.name}</Text>
            <View style={styles.modalInpuit}>
              <TextInput
                style={styles.input}
                onChangeText={setTimeLimit}
                value={timeLimit}
                keyboardType="numeric"
              />
              <Text style={styles.modalText}>Minutes</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setTimeLimit(timeLimit);
                  setTimers({
                    ...timers,
                    [props.name]: timeLimit, // set the initial timer value to the item's usageDuration
                  });
                  handleClose();
                }}>
                <Text style={styles.textStyle}>Set</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => handleClose()}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => console.log(timers)}>
                <Text style={styles.textStyle}>log timers</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    shadowColor: '#000',
    gap: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 7,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
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
