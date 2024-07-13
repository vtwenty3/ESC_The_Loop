import React from 'react'
import { View, Modal } from 'react-native'

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function CustomModal(props: Props) {
  return (
    <Modal animationType="fade" transparent visible={props.visible}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-xl w-fit border-2 border-black items-center justify-center p-4" style={{ gap: 20 }}>
          {props.children}
        </View>
      </View>
    </Modal>
  )
}