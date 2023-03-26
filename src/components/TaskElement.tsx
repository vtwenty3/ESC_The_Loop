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
  // title: string;
  // description: string;
  item: {
    title: string;
    description: string;
    timestamp: string;
  };
  onOpenModal: (item: object) => void;
};
export default function Task(props: Props) {
  const [shadow, setShadow] = useState(-5);
  const [isPressedTick, setIsPressedTick] = useState(false);
  const [isPressedTask, setIsPressedTask] = useState(false);
  const [normalTextOpacity] = useState(new Animated.Value(1));
  const [strikethroughTextOpacity] = useState(new Animated.Value(0));
  const animatedValueTick = useRef(new Animated.Value(0)).current;
  const animatedValueTask = useRef(new Animated.Value(0)).current;
  const [strike, setStrike] = useState(false);

  const toggleStrike = () => {
    if (strike) {
      Animated.timing(strikethroughTextOpacity, {
        toValue: 0,
        delay: 150,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(normalTextOpacity, {
        toValue: 1,
        delay: 50,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setStrike(false));
    } else {
      setStrike(true);
      Animated.timing(normalTextOpacity, {
        toValue: 0,
        delay: 150,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(strikethroughTextOpacity, {
        toValue: 1,
        delay: 50,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.taskWrapper}>
      <View style={styles.taskShadow}>
        <Animated.View
          style={{
            transform: [
              {translateX: animatedValueTask},
              {translateY: animatedValueTask},
            ],
          }}>
          <TouchableOpacity
            onPress={() => props.onOpenModal(props.item)}
            onPressIn={() => setIsPressedTask(true)}
            onPressOut={() => setIsPressedTask(false)}
            activeOpacity={1}
            style={[
              styles.task,
              {transform: [{translateX: shadow}, {translateY: shadow}]},
            ]}>
            <View style={styles.container}>
              <Animated.Text
                style={[
                  styles.text,
                  {
                    opacity: normalTextOpacity,
                  },
                ]}>
                {props.item.title}
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.text,
                  {
                    textDecorationLine: 'line-through',
                    position: 'absolute',
                    opacity: strikethroughTextOpacity,
                  },
                ]}>
                {props.item.title}
              </Animated.Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.tickShadow}>
        <Animated.View
          style={{
            transform: [
              {translateX: animatedValueTick},
              {translateY: animatedValueTick},
            ],
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.tickButton,
              {transform: [{translateX: shadow}, {translateY: shadow}]},
            ]}
            onPressIn={() => {
              toggleStrike();
              setIsPressedTick(!isPressedTick);
              if (isPressedTick) {
                Animated.spring(animatedValueTask, {
                  //duration: 600,
                  toValue: 0,
                  delay: 600,
                  stiffness: 270,
                  damping: 3.7,
                  mass: 0.6,
                  restSpeedThreshold: 1,
                  restDisplacementThreshold: 0.5,
                  useNativeDriver: true,
                }).start();
                Animated.spring(animatedValueTick, {
                  //duration: 600,
                  toValue: 0,
                  stiffness: 270,
                  damping: 3.7,
                  mass: 0.4,
                  restSpeedThreshold: 1,
                  restDisplacementThreshold: 0.5,
                  useNativeDriver: true,
                }).start();
              } else {
                Animated.timing(animatedValueTask, {
                  duration: 800,
                  delay: 600,
                  toValue: -shadow,
                  easing: Easing.out(Easing.circle),
                  useNativeDriver: true,
                }).start();
                Animated.timing(animatedValueTick, {
                  duration: 800,
                  toValue: -shadow,
                  easing: Easing.out(Easing.circle),
                  useNativeDriver: true,
                }).start();
              }
            }}
            onPress={props.onPressTick}>
            <Icon name="check-bold" size={30} color={'black'} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskWrapper: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    paddingTop: 10,
  },
  task: {
    borderWidth: 2,
    zIndex: 3,
    borderRadius: 10,
    backgroundColor: '#FDF2AD',
    // transform: [{translateX: -6}, {translateY: -6}],
  },
  tickButton: {
    padding: 7,
    backgroundColor: '#59C570',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 5,
    // transform: [{translateX: -6}, {translateY: -6}],
  },
  tickShadow: {
    backgroundColor: 'black',
    borderRadius: 8,
  },
  taskShadow: {
    backgroundColor: 'black',
    borderRadius: 10,
    alignSelf: 'center',
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  strike: {
    backgroundColor: 'black',
    height: 2,
    alignSelf: 'center',
    width: 200,
    top: '50%',
    right: 0,
  },
  text: {
    fontSize: 18,
    padding: 10,
    fontFamily: 'Lexend-Medium',
    color: 'black',
  },
});
