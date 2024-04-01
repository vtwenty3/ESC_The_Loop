import {Modal, StyleSheet, Text, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import InputFiled from './InputFiledElement'
import BrutalButton from './BrutalButton'
import ToggleButtons from './ToggleButtons'

type Props = {
  item: any;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (itemUpdated: object, timestampOld: string) => void;
  onDelete: (timestamp: string) => void;

  autofocusTitle: boolean;
  autofocusDescription: boolean;
};
export default function EditModal(props: Props) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [type, setType] = useState<string>('note')
  const [pop, setPop] = useState<boolean>(false)
  const [timestampOld, setTimestampOld] = useState<string>('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  function close() {
    props.setVisible(false)
    setDeleteConfirm(false)
  }
  useEffect(() => {
    setTitle(props.item.title)
    setDescription(props.item.description)
    setType(props.item.type)
    setTimestampOld(props.item.timestamp)
    setDeleteConfirm(false)
  }, [props.item])

  return (
    <Modal animationType="fade" visible={props.visible} transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalChildren}>
          <View style={styles.noteDeleteWrapper}>
            <View style={{flex: 1}}>
              <InputFiled
                autofocus={props.autofocusTitle}
                pop={pop}
                placeholder="Title"
                value={title}
                setValue={setTitle}
              />
            </View>
            <BrutalButton
              color={deleteConfirm ? '#e30000' : '#FF6B6B'}
              getStuck={deleteConfirm}
              iconName={
                deleteConfirm ? 'delete-forever-outline' : 'delete-outline'
              }
              onPress={() => {
                if (deleteConfirm) {
                  props.onDelete(timestampOld)
                }
                setDeleteConfirm(true)
              }}
            />
          </View>

          <InputFiled
            autofocus={props.autofocusDescription}
            pop={pop}
            placeholder="Description"
            value={description}
            setValue={setDescription}
            multiline={true}
            numberOfLines={13}
            fontFamily={'Lexend-Regular'}
            fontSize={16}
          />
          {/* <ToggleButtons type={type} setType={setType} /> */}
          <View style={styles.brutalButtonWrapper}>
            <View style={styles.brutalButton}>
              <BrutalButton
                text="Close"
                color="#FF6B6B"
                iconName="close-circle-outline"
                onPress={() => {
                  close()
                }}
              />
            </View>

            <View style={styles.brutalButton}>
              <BrutalButton
                text={'Save'}
                onPress={() => {
                  const itemUpdated = {
                    title,
                    description,
                    type,
                    tags: '',
                    timestamp: new Date().toISOString(),
                    complete: false,
                  }
                  props.onSave(itemUpdated, timestampOld)
                  close()
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  brutalButtonWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginLeft: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000063',
  },
  modalChildren: {
    width: '92%',
    //height: '94%',
    gap: 20,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: 'column',
  },
  brutalButton: {
    width: '45%',
  },
  noteDeleteWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
})
