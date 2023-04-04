import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';

type Props = {
  item: {
    title: string;
    description: string;
    timestamp: string;
  };
  onOpenModal: (item: object) => void;
  modalVisible: boolean;
};

export default function Note(props: Props) {
  const [shadow, setShadow] = useState(-5);
  const [isPressed, setIsPressed] = useState(false);
  const animatedValueNote = useRef(new Animated.Value(shadow)).current;

  useEffect(() => {
    if (props.modalVisible == false && isPressed == true) {
      handlePressOutNote();
    }
  }, [props.modalVisible]);

  const handlePressInNote = () => {
    setIsPressed(true);
    setTimeout(() => {
      Vibration.vibrate(12);
    }, 60);
    Animated.timing(animatedValueNote, {
      duration: 300,
      toValue: 0,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOutNote = () => {
    setTimeout(() => {
      Vibration.vibrate(14);
    }, 600);

    Animated.spring(animatedValueNote, {
      toValue: shadow,
      delay: 600,
      stiffness: 270,
      damping: 3.7,
      mass: 0.6,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={[styles.noteWrapper, {paddingTop: -shadow, paddingLeft: -shadow}]}>
      <View>
        <TouchableOpacity
          onPress={() => props.onOpenModal(props.item)}
          onPressIn={() => handlePressInNote()}
          activeOpacity={1}>
          <View style={[styles.textWrapperShadow]}>
            <Text style={[styles.titleText]}>{props.item.title}</Text>
          </View>
          <Animated.View
            style={[
              styles.textWrapper,
              {
                transform: [
                  {translateX: animatedValueNote},
                  {translateY: animatedValueNote},
                ],
              },
            ]}>
            <Text style={[styles.titleText]}>{props.item.title}</Text>
          </Animated.View>
          <View style={[styles.descriptionWrapperShadow]}></View>
          <Animated.View
            style={[
              styles.descriptionWrapper,
              {
                transform: [
                  {translateX: animatedValueNote},
                  {translateY: animatedValueNote},
                ],
              },
            ]}>
            <Text style={[styles.descriptionText]}>
              {props.item.description}
            </Text>
          </Animated.View>
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
    width: '90%',
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
    fontFamily: 'Lexend-Regular',
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
