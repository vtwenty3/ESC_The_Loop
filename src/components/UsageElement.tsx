import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
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
  onOpenModal: (appName: string, packageName: string) => void;
};
export default function UsageElement(props: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const animatedValueTask = useRef(
    new Animated.Value(isPressed ? 0 : -4),
  ).current;

  // const calculateUsagePercentage = () => {
  //   //const totalTime = props.timers[props.item.packageName]?.timeSet || 0;
  //   const usageTime = props.item.usageTimeSeconds || 0;
  //   const timeLeft = props.timers[props.item.packageName]?.timeLeft || 0;
  //   const totalTime = Number(usageTime) + timeLeft;
  //   //const usageTime = totalTime - timeLeft;
  //   const percentage = (timeLeft / totalTime) * 100;
  //   console.log(props.item.appName, ':', percentage);
  //   return percentage;
  // };

  const calculateUsagePercentage = () => {
    const usageTime = props.item.usageTimeSeconds || 0;
    const timeLeft = props.timers[props.item.packageName]?.timeLeft || 0;
    const totalTime = Number(usageTime) + timeLeft;
    const percentage = (Number(usageTime) / totalTime) * 100;
    console.log(props.item.appName, ':', percentage);
    return percentage;
  };

  const handlePressIn = () => {
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
    Animated.spring(animatedValueTask, {
      toValue: -4,
      stiffness: 270,
      damping: 3.7,
      mass: 0.4,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 0.5,
      useNativeDriver: true,
    }).start();
  };
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          props.onOpenModal(props.item.appName, props.item.packageName);
          // setModalVisible(true);
        }}>
        <View style={styles.appContainerShadow}>
          <Animated.View
            style={[
              styles.appContainer,
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
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Lexend-SemiBold',
                  fontSize: 17,
                  color: 'black',
                }}>
                {props.item.appName}
              </Text>
              {/* <View style={styles.appContainerText}>
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
              </View> */}
              <View style={styles.usageBarWrapper}>
                <View style={styles.usageBar}>
                  <View style={styles.usageTextWrapper}>
                    <Text style={styles.usageText}>
                      Used: {props.item.usageTimeSeconds} s
                    </Text>
                    <Text style={[styles.usageText, styles.timeLeftText]}>
                      Left: {props.timers[props.item.packageName]?.timeLeft} s
                    </Text>
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
  appContainerShadow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    borderColor: 'black',
  },
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2AD',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    zIndex: 20,
    padding: 5,
    transform: [{translateX: -6}, {translateY: -6}],
  },
  usageContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 10,
    zIndex: 4,
  },
  appContainerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainContainer: {
    paddingTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 25,
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
