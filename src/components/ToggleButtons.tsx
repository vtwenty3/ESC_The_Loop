import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import React, {useState, useRef} from 'react';

type Props = {
  isTask: boolean;
  setIsTask: React.Dispatch<React.SetStateAction<boolean>>;
};
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ToggleButtons(props: Props) {
  const [title, onChangeTitle] = React.useState('');
  const [task, setTask] = useState(true);
  const [note, setNote] = useState(false);

  const [firstButtonClicked, setFirstButtonClicked] = useState(false);

  const animatedValueTask = useRef(new Animated.Value(task ? 0 : -4)).current;
  const animatedValueNote = useRef(new Animated.Value(note ? 0 : -4)).current;

  const firstAnimatedValue = useRef(
    new Animated.Value(firstButtonClicked ? 0 : -4),
  ).current;

  return (
    <View style={styles.buttonsWrapper}>
      <View style={styles.buttonShadow}>
        <Animated.View
          style={{
            transform: [
              {translateX: animatedValueTask},
              {translateY: animatedValueTask},
            ],
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              props.setIsTask(true);
              Animated.timing(animatedValueTask, {
                duration: 600,
                toValue: 0,
                easing: Easing.out(Easing.circle),
                useNativeDriver: true,
              }).start();
              Animated.spring(animatedValueNote, {
                toValue: -4,
                stiffness: 270,
                damping: 3.7,
                mass: 0.4,
                delay: 150,
                restSpeedThreshold: 1,
                restDisplacementThreshold: 0.5,
                useNativeDriver: true,
              }).start();
            }}
            style={styles.button}>
            <Icon
              name="checkbox-marked-circle-outline"
              size={25}
              color={'black'}
            />
            <Text style={styles.text}>Task</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.buttonShadow}>
        <Animated.View
          style={{
            transform: [
              {translateX: animatedValueNote},
              {translateY: animatedValueNote},
            ],
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              props.setIsTask(false);
              Animated.timing(animatedValueNote, {
                duration: 600,
                toValue: 0,
                easing: Easing.out(Easing.circle),
                useNativeDriver: true,
              }).start();
              Animated.spring(animatedValueTask, {
                toValue: -4,
                stiffness: 270,
                damping: 3.7,
                mass: 0.4,
                delay: 150,
                restSpeedThreshold: 1,
                restDisplacementThreshold: 0.5,
                useNativeDriver: true,
              }).start();
            }}
            style={styles.button}>
            <Icon name="circle-edit-outline" size={25} color={'black'} />

            <Text style={styles.text}>Note</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    padding: 10,
    zIndex: 3,
    borderRadius: 10,
    backgroundColor: '#FDF2AD',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: 'black',
    fontFamily: 'Lexend-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonShadow: {
    alignSelf: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    width: '45%',
    zIndex: 2,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
});
