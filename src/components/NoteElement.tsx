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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  onPressTick: () => void;
  onPressTask: () => void;
  title: string;
  description: string;
};
export default function Note(props: Props) {
  const [shadow, setShadow] = useState(-6);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.noteWrapper}>
      <View>
        <TouchableOpacity
          onPress={props.onPressTask}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}>
          <View style={[styles.textWrapperShadow]}>
            <Text style={[styles.titleText]}>{props.title}</Text>
          </View>

          <View
            style={[
              styles.textWrapper,
              !isPressed && {
                transform: [{translateX: shadow}, {translateY: shadow}],
              },
            ]}>
            <Text style={[styles.titleText]}>{props.title}</Text>
          </View>
          <View style={[styles.descriptionWrapperShadow]}></View>
          <View
            style={[
              styles.descriptionWrapper,
              !isPressed && {
                transform: [{translateX: shadow}, {translateY: shadow}],
              },
            ]}>
            <Text style={[styles.descriptionText]}>{props.description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteWrapper: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    width: '90%',
    paddingVertical: 6,
  },

  textWrapper: {
    padding: 10,
    backgroundColor: '#FDF2AD',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    minWidth: '100%',
    zIndex: 2,
  },
  textWrapperShadow: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    minWidth: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10,
    zIndex: 1,
  },
  descriptionWrapper: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 10,
    width: '97%',
    alignSelf: 'center',
    marginTop: -10,
    zIndex: 1,
    height: 100,
  },

  descriptionWrapperShadow: {
    backgroundColor: 'black',
    position: 'absolute',
    alignSelf: 'center',
    height: 100,
    width: '97%',
    borderRadius: 10,
    zIndex: 0,
    bottom: 0,
    marginBottom: 10,
  },

  titleText: {
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    color: 'black',
  },

  descriptionText: {
    fontSize: 14,
    fontFamily: 'Lexend-Light',
    color: 'black',
  },

  text: {
    fontSize: 18,
    padding: 10,
    fontFamily: 'Lexend-Medium',
    color: 'black',
    minWidth: '95%',
  },
});
