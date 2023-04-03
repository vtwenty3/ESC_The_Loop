import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import InputFiled from './InputFiledElement';
import BrutalButton from './BrutalButton';
import ToggleButtons from './ToggleButtons';

type Props = {
  item: any;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (itemUpdated: object, timestampOld: string) => void;
  autofocusTitle: boolean;
  autofocusDescription: boolean;
};
export default function EditModal(props: Props) {
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [type, setType] = React.useState<string>('note');
  const [pop, setPop] = React.useState<boolean>(false);
  const [timestampOld, setTimestampOld] = React.useState<string>('');

  function close() {
    props.setVisible(false);
  }
  useEffect(() => {
    setTitle(props.item.title);
    setDescription(props.item.description);
    setType(props.item.type);
    setTimestampOld(props.item.timestamp);
  }, [props.item]);

  return (
    <Modal animationType="fade" visible={props.visible} transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalChildren}>
          <InputFiled
            autofocus={props.autofocusTitle}
            pop={pop}
            placeholder="Title"
            value={title}
            setValue={setTitle}
          />
          <InputFiled
            autofocus={props.autofocusDescription}
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
            <View style={styles.brutalButton}>
              <BrutalButton
                text={'Close'}
                onPress={() => {
                  close();
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
                  };
                  props.onSave(itemUpdated, timestampOld);
                  close();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
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
    width: '90%',
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
});
