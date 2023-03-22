import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import InputFiled from '../components/InputFiled';
import Title from '../components/Title';
import Esc from '../components/Esc';
import ToggleButtons from '../components/ToggleButtons';
import BrutalButton from '../components/BrutalButton';

export function Create() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isTask, setIsTaks] = useState(true);
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerChildren}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Create'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>
      <View style={styles.body}>
        <InputFiled placeholder="Title" value={title} setValue={setTitle} />
        <InputFiled
          placeholder="Description"
          value={description}
          setValue={setDescription}
          multiline={true}
          numberOfLines={3}
          fontFamily={'Lexend-Regular'}
          fontSize={16}
        />
        <ToggleButtons isTask={isTask} setIsTask={setIsTaks} />

        <View style={styles.brutalButtonWrapper}>
          <View style={styles.brutalButtonFiller}></View>
          <View style={styles.brutalButtonFiller}>
            <BrutalButton
              onPress={() =>
                console.log(isTask ? 'Task' : 'Note', title, description)
              }
            />
          </View>
        </View>
      </View>
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
});
