import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image,
  Vibration,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
interface Timers {
  [key: string]: {timeLeft?: number; timeSet?: number};
}
type Props = {
  item: {
    packageName: string;
    appName: string;
    usageTimeSeconds: string;
    usageTimeMinutes: string;
    iconBase64: string;
  };
  setTimers: React.Dispatch<React.SetStateAction<Timers>>;
  timers: Timers;
  modalVisible: boolean;
  onOpenModal: (appName: string, packageName: string) => void;
};
export default function UsageElement(props: Props) {
  const [shadow, setShadow] = useState(-5);
  const [isPressed, setIsPressed] = useState(false);
  const animatedValueTask = useRef(
    new Animated.Value(isPressed ? 0 : shadow),
  ).current;
  const calculateUsagePercentage = () => {
    const usageTime = props.item.usageTimeSeconds || 0;
    const timeLeft = props.timers[props.item.packageName]?.timeLeft || 0;
    const totalTime = Number(usageTime) + timeLeft;
    const percentage = (Number(usageTime) / totalTime) * 100;

    return percentage;
  };

  useEffect(() => {
    if (props.modalVisible == false && isPressed == true) {
      handlePressOut();
    }
  }, [props.modalVisible]);

  const handlePressIn = () => {
    Vibration.vibrate(11);
    setIsPressed(true);
    Animated.spring(animatedValueTask, {
      toValue: 0,
      stiffness: 170,
      damping: 6.7,
      mass: 0.2,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    setTimeout(() => {
      Vibration.vibrate(10);
    }, 800);
    Animated.spring(animatedValueTask, {
      toValue: shadow,
      delay: 800,
      stiffness: 470,
      damping: 5.4,
      mass: 0.8,
      restSpeedThreshold: 0.2,
      restDisplacementThreshold: 0.2,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={[
        styles.UsageWrapper,
        {paddingTop: -shadow, paddingLeft: -shadow},
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        // onPressOut={handlePressOut}
        onPress={() => {
          props.onOpenModal(props.item.appName, props.item.packageName);
        }}>
        <View style={styles.usageShadow}>
          <Animated.View
            style={[
              styles.usageChildrenWrapper,
              {
                transform: [
                  {translateX: animatedValueTask},
                  {translateY: animatedValueTask},
                ],
              },
            ]}>
            <Image
              source={{uri: `data:image/png;base64,${props.item.iconBase64}`}} //important to add the data:image/png;base64, part
              style={styles.image}
            />
            <View style={styles.textAndBarWrapper}>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  justifyContent: 'space-between',
                  paddingRight: 5,
                }}>
                <Text style={styles.appName}>{props.item.appName}</Text>
                {props.timers[props.item.packageName]?.timeSet ==
                null ? null : (
                  <Text style={styles.appTimeSet}>
                    Set: {props.timers[props.item.packageName]?.timeSet}s
                  </Text>
                )}
              </View>
              <View style={styles.usageBarWrapper}>
                <View style={styles.usageBar}>
                  <View style={styles.usageTextWrapper}>
                    <Text style={styles.usageText}>
                      Used: {props.item.usageTimeSeconds}s
                    </Text>
                    {props.timers[props.item.packageName]?.timeLeft == null ? (
                      ''
                    ) : (
                      <Text style={[styles.usageText, styles.timeLeftText]}>
                        Left: {props.timers[props.item.packageName]?.timeLeft}s
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.usageBarFill,
                      {width: `${calculateUsagePercentage()}%`},
                    ]}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  UsageWrapper: {
    width: '90%',
    alignSelf: 'center',
  },
  usageShadow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    borderColor: 'black',
  },
  usageChildrenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2AD',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    padding: 9,
    gap: 8,
    zIndex: 20,
  },
  image: {
    width: 54,
    height: 54,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 27,
  },

  textAndBarWrapper: {
    flexDirection: 'column',
    flex: 1,
  },
  appName: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 17,
    color: 'black',
    paddingBottom: 5,
  },
  usageBar: {
    backgroundColor: '#DE6464',
    width: '100%',
    height: '100%',
  },
  usageBarFill: {
    backgroundColor: '#FFB5C6',
    height: '100%',
    width: '100%',
  },
  usageText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Lexend-Regular',
  },
  appTimeSet: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Lexend-Regular',
    marginTop: 2,
  },

  timeLeftText: {
    right: 0,
  },
  usageTextWrapper: {
    position: 'absolute',
    zIndex: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 5,
  },
  usageBarWrapper: {
    width: '100%',
    height: 29,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

{
  /* <View style={styles.appContainerText}>
                <Text style={{color: 'black'}}>
                  <Text style={{fontWeight: 'bold'}}>Usage: </Text>
                  {props.item.usageTimeMinutes} Minutes
                </Text>
                <Text style={{color: 'black'}}>
                  {props.item.usageTimeSeconds} Seconds
                </Text>
              </View>
              <View style={styles.appContainerText}>
                <Text style={{color: 'red'}}>
                  <Text style={{fontWeight: 'bold'}}>Timers: </Text>
                  {props.timers[props.item.packageName]?.timeLeft}
                </Text>
                <Text style={{color: 'red'}}>
                  {props.timers[props.item.packageName]?.timeSet} set
                </Text>
              </View> */
}
// appContainerText: {
//   color: 'black',
//   fontSize: 16,
//   fontWeight: 'bold',
//   flexDirection: 'row',
//   justifyContent: 'space-between',
// },
