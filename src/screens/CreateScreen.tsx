import {StyleSheet, View, Modal, Text, Keyboard} from 'react-native';
import React, {useState} from 'react';
import InputFiled from '../components/InputFiledElement';
import Title from '../components/TitleElement';
import Esc from '../components/EscElement';
import ToggleButtons from '../components/ToggleButtons';
import BrutalButton from '../components/BrutalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Create() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [type, setType] = useState('Task');
  const [modalEmpty, setModalEmpty] = useState(false);
  const [modalCreated, setModalCreated] = useState(false);
  const [pop, setPop] = useState(false);
  function complete() {
    Keyboard.dismiss();
    setTimeout(function () {
      setModalCreated(true);
    }, 200);
  }
  function clearInputs() {
    setTitle('');
    setDescription('');
  }

  async function SaveData() {
    //  console.log(isTask ? 'Task' : 'Note', title, description);
    // Create a data object to store
    if (title === '') {
      setModalEmpty(true);
      return;
    }
    const data = {
      title,
      description,
      type,
      tags: '',
      timestamp: new Date().toISOString(),
    };

    // Get the current data in storage

    const currentDataString = await AsyncStorage.getItem('@myData');

    // If there is no current data, create a new array and add the new data
    if (!currentDataString) {
      const newDataString = JSON.stringify([data]);
      await AsyncStorage.setItem('@myData', newDataString);
    } else {
      // If there is current data, parse it and add the new data to the array
      const currentData = JSON.parse(currentDataString);
      currentData.push(data);
      const newDataString = JSON.stringify(currentData);
      await AsyncStorage.setItem('@myData', newDataString);
    }

    // Log the saved data and navigate back to previous screen
    console.log('Saved:', data);
    complete();
  }

  async function PrintData() {
    const currentDataString = await AsyncStorage.getItem('@myData');
    console.log(currentDataString);
  }
  const animateChild = () => {
    console.log('Animation started!');
    setPop(!pop);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerChildren}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Create'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>
      <View style={styles.body}>
        <InputFiled
          pop={pop}
          placeholder="Title"
          value={title}
          setValue={setTitle}
        />
        <InputFiled
          pop={pop}
          placeholder="Description"
          value={description}
          setValue={setDescription}
          multiline={true}
          numberOfLines={3}
          fontFamily={'Lexend-Regular'}
          fontSize={16}
        />
        <ToggleButtons type={type} setType={setType} />

        <View style={styles.brutalButtonWrapper}>
          <View style={styles.brutalButtonFiller}></View>
          <View style={styles.brutalButtonFiller}>
            <BrutalButton text={'Create'} onPress={SaveData} />
            {/* <BrutalButton onPress={PrintData} /> */}
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalEmpty}
        onRequestClose={() => setModalEmpty(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalChildren}>
            {/* <Esc
              onPress={() =>
                setTimeout(function () {
                  setModalVis(false);
                  //your code here
                }, 50)
              }
            /> */}
            <Text style={styles.modalText}>Title Empty</Text>
            <BrutalButton
              text={'OK'}
              onPress={() =>
                setTimeout(function () {
                  setModalEmpty(false);
                }, 350)
              }
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCreated}
        onRequestClose={() => setModalCreated(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalChildren}>
            <Text style={styles.modalText}>{type} Created</Text>
            <BrutalButton
              text={'OK'}
              onPress={() => {
                setTimeout(function () {
                  setPop(!pop);
                  clearInputs();
                  setModalCreated(false);
                }, 350);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#9723C9',
    height: 140,
    width: '100%',
  },
  headerChildren: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -10,
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    width: '100%',
    top: -20,
    gap: 20,
  },
  brutalButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  brutalButtonFiller: {
    width: '45%',
  },
  modalBackground: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000bf',
  },
  modalChildren: {
    alignSelf: 'center',
    // flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
    backgroundColor: '#FBF4E7',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    padding: 20,
  },

  modalText: {
    alignSelf: 'center',
    fontSize: 24,
    fontFamily: 'Lexend-SemiBold',
    color: 'black',
  },
});
