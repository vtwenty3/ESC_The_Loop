import React, {useState} from 'react'
import {useFocusEffect } from '@react-navigation/native'
import {globalStyles} from '../globalStyles'
import {View, FlatList} from 'react-native'
import ModalEdit from '../components/ModalEdit'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import Task from '../components/TaskElement'
import NoDataFound from '../components/NoDataFound'
import * as localStorage from '../services/LocalStorage'

export function Tasks() {
  const [data, setData] = useState<any>()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalObject, setModalObject] = useState({})


  const handleSave = async (itemUpdated: object, timestampOld: string) => {
    const findIndex = data.findIndex(
      (obj: any) => obj.timestamp === timestampOld,
    )
    if (findIndex !== -1) {
      data.splice(findIndex, 1) // Remove the object at the found index
      data.push(itemUpdated) // Append the new object to the end of the array
    }
    await localStorage.setDataByKey('@local_tasks', data)
    setModalVisible(false)
  }

  const handleDelete = async (timestamp: string) => {
    const findIndex = data.findIndex((obj: any) => obj.timestamp === timestamp)
    if (findIndex !== -1) {
      data.splice(findIndex, 1) // Remove the object at the found index
    }
    await localStorage.setDataByKey('@local_tasks', data)
    await fetchData()
    setTimeout(() => {
      setModalVisible(false)
    }, 400)
  }

  const handleComplete = async (timestamp: string, complete: boolean) => {
    const findIndex = data.findIndex((obj: any) => obj.timestamp === timestamp)
    if (findIndex !== -1) {
      data[findIndex].complete = !complete
    }
    await localStorage.setDataByKey('@local_tasks', data)
  }

  const isActive = true

  const fetchData = async () => {
    try {
      const data = await localStorage.getDataByKey('@local_tasks')
      if (isActive) {
        setData(data)
        // console.log('data:', data, typeof data)
      }
    } catch (e) {
      console.log('Error fetchData:', e)
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    }, []),
  )

  return (
    <View style={[globalStyles.root]}>
      <View style={[globalStyles.header]}>
        <View style={[globalStyles.headerChildren]}>
          <Esc onPress={() => console.log('Esc')} />
          <Title text={'Tasks'} fontFamily={'Lexend-Medium'} fontSize={40} />
        </View>
      </View>

      <View style={[globalStyles.body]}>
        {!data === undefined || data == null || data.length === 0 ? (
          <NoDataFound
            boldText="No Tasks Found"
            boldTextSize={20}
            text="Add a task by pressing the + button"
          />
        ) : (
          <FlatList
            contentContainerStyle={{paddingTop: 15, gap: 5}}
            data={data}
            keyExtractor={item => item.key}
            renderItem={({item}) => (
              <Task
                onOpenModal={() => {
                  setModalObject(item)
                  setModalVisible(true)
                }}
                item={item}
                modalVisible={modalVisible}
                onPressTask={() => console.log('')}
                onPressTick={handleComplete}
                onPressDelete={handleDelete}
              />
            )}
          />
        )}
        <ModalEdit
          autofocusDescription={false}
          autofocusTitle={true}
          setVisible={setModalVisible}
          visible={modalVisible}
          item={modalObject}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </View>
    </View>
  )
}

