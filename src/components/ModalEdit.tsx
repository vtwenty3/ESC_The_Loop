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
      <View className='flex-1 flex justify-center items-center bg-modalBgColor'>
        <View className='w-[92%] bg-[#D9D9D9] rounded-xl py-5 px-2.5 border-2 border-black flex flex-col gap-y-4'  >
          <View  className='flex flex-row items-center justify-center'>
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
          <View>
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
          </View>
          {/* <ToggleButtons type={type} setType={setType} /> */}
          <View className='flex flex-row w-full justify-between self-center ml-1'>
            <View className='w-[45%]'>
              <BrutalButton
                text="Close"
                color="#FF6B6B"
                iconName="close-circle-outline"
                onPress={() => {
                  close()
                }}
              />
            </View>

            <View className='w-[45%]'>
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