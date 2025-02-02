import {StyleSheet, View, Modal, Text, Keyboard} from 'react-native'
import React, {useState} from 'react'
import InputFiled from '../components/InputFiledElement'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import ToggleButtons from '../components/ToggleButtons'
import BrutalButton from '../components/BrutalButton'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import * as localStorage from '../services/LocalStorage'
import { Note, Task } from '../types'
import { Notes } from './NotesScreen'

export function Create() {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [type, setType] = useState<'Task' | 'Note'>('Task')
  const [modalEmpty, setModalEmpty] = useState(false)
  const [modalCreated, setModalCreated] = useState(false)
  const [pop, setPop] = useState(false)
  function complete() {
    Keyboard.dismiss()
    setTimeout(function () {
      setModalCreated(true)
    }, 200)
  }

  function clearInputs() {
    setTitle('')
    setDescription('')
  }


  async function onCreate() {
    if (title === '') {
      setModalEmpty(true)
      return
    }

    const localKey = type === 'Task' ? '@local_tasks' : '@local_notes'

    const currentData: Note | Task = {
      title,
      description,
      type,
      tags: '',
      complete: false,
      timestamp: new Date().toISOString(),
    }

    const composeData = (previousData: Note[] | Task[] | null, current: Note | Task) => {
      if (previousData) {
        return [...previousData, current]
      } else {
        return [current]
      }
    }

    const previousData: (Note | Task)[] | null = await localStorage.getDataByKey(localKey)

    console.log(previousData)

    // @ts-ignore
    await localStorage.setDataByKey(localKey, composeData(previousData, currentData))
    complete()

  }

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
          autofocus={true}
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
            <BrutalButton text={'Create'} onPress={onCreate} />
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
            <Text style={styles.modalText}>Title Empty</Text>
            <BrutalButton
              text={'OK'}
              onPress={() =>
                setTimeout(function () {
                  setModalEmpty(false)
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
                  setPop(true)
                  clearInputs()
                  setModalCreated(false)
                }, 350)
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
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
    width: '90%',
    top: -20,
    gap: 20,
  },
  brutalButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  brutalButtonFiller: {
    width: '45%',
  },
  modalBackground: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000063',
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
})
