import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
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
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    width: '90%',
  },
});
