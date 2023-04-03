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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  onPressTick: (timestamp: string, complete: boolean) => void;
  onPressDelete: (timestamp: string) => void;

  onPressTask: () => void;
  item: {
    title: string;
    description: string;
    timestamp: string;
    complete: boolean;
  };
  onOpenModal: (item: object) => void;
  //onComplete: (timestampOld: string) => void;

  modalVisible: boolean;
};
export default function Task(props: Props) {
  const [shadow, setShadow] = useState(-5);
  const [isPressedTick, setIsPressedTick] = useState(false);
  const [isPressedTask, setIsPressedTask] = useState(false);
  const [normalTextOpacity] = useState(new Animated.Value(1));
  const [strikethroughTextOpacity] = useState(new Animated.Value(0));
  const animatedValueTick = useRef(new Animated.Value(0)).current;
  const animatedValueTask = useRef(new Animated.Value(0)).current;
  const animatedOut = useRef(new Animated.Value(0)).current;

  const [strike, setStrike] = useState(false);
  const [complete, setComplete] = useState(props.item.complete);
  const [animatedColor] = useState(new Animated.Value(0));

  useEffect(() => {
    if (props.modalVisible == false && props.item.complete == false) {
      handlePressOutTask();
    }
  }, [props.modalVisible]);

  useEffect(() => {
    if (props.item.complete == true) {
      setStrike(true);
      handlePressInTick();
      toggleStrike();
    }
  }, []);

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

  const handlePressInTick = () => {
    toggleStrike();
    setIsPressedTick(!isPressedTick);
    if (isPressedTick) {
      setTimeout(() => {
        Vibration.vibrate(13);
      }, 300);

      Animated.spring(animatedValueTask, {
        //duration: 600,
        toValue: 0,
        delay: 300,
        stiffness: 270,
        damping: 3.7,
        mass: 0.6,
        restSpeedThreshold: 1,
        restDisplacementThreshold: 0.5,
        useNativeDriver: true,
      }).start(() => {
        if (complete == false) {
          Vibration.vibrate(12);
          Animated.spring(animatedValueTick, {
            toValue: 0,
            stiffness: 270,
            damping: 3.7,
            mass: 0.4,
            restSpeedThreshold: 1,
            restDisplacementThreshold: 0.5,
            useNativeDriver: true,
          }).start();
        }
      });
    } else {
      Animated.timing(animatedValueTick, {
        duration: 800,
        toValue: -shadow,
        easing: Easing.out(Easing.circle),
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(animatedValueTask, {
          duration: 800,
          toValue: -shadow,
          easing: Easing.out(Easing.circle),
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePressInTask = () => {
    setIsPressedTask(true);
    Vibration.vibrate(10);
    Animated.timing(animatedValueTask, {
      duration: 300,
      toValue: -shadow,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  };

  const handleDeleteAnimation = () => {
    Animated.timing(animatedOut, {
      delay: 500,
      duration: 600,
      toValue: 500,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start(() => props.onPressDelete(props.item.timestamp));
  };

  const handlePressOutTask = () => {
    Animated.spring(animatedValueTask, {
      toValue: 0,
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
    <Animated.View
      style={{
        transform: [{translateX: animatedOut}],
      }}>
      <View
        style={[
          styles.taskWrapper,
          {paddingTop: -shadow, paddingLeft: -shadow},
        ]}>
        <View style={styles.taskShadow}>
          <Animated.View
            style={{
              transform: [
                {translateX: animatedValueTask},
                {translateY: animatedValueTask},
              ],
            }}>
            <TouchableOpacity
              onPress={() => {
                if (complete == false) {
                  props.onOpenModal(props.item);
                } else {
                  setComplete(false);
                  props.onPressTick(props.item.timestamp, false);
                  handlePressInTick();
                }
              }}
              onPressIn={handlePressInTask}
              //onPressOut={() => setIsPressedTask(false)}
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
                {backgroundColor: complete ? '#E95B5B' : '#59C570'},
                {
                  transform: [{translateX: shadow}, {translateY: shadow}],
                },
              ]}
              onPressIn={() => {
                handlePressInTick();
              }}
              onPress={() => {
                if (complete) {
                  console.log('delete');
                  handleDeleteAnimation(); //also delete from database
                } else {
                  setComplete(!complete);
                  props.onPressTick(props.item.timestamp, complete);
                }
              }}>
              <Icon
                name={complete ? 'trash-can-outline' : 'check-bold'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  taskWrapper: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    width: '90%',
    marginBottom: 5,
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
