import React from 'react'
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  TouchableHighlight
} from 'react-native'

const { width } = Dimensions.get('window')

export default class ImageTile extends React.PureComponent {
  render () {
    let { item, index, selected, selectImage, selectedItemCount, badgeColor } = this.props
    if (!item) return null
    return (
      <TouchableHighlight
        style={{ opacity: selected ? 0.8 : 1 }}
        underlayColor='transparent'
        onPress={() => selectImage(index)} >

        <View style={{ position: 'relative' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground
              style={{ width: width / 4, height: width / 4 }}
              source={{ uri: item.uri }} >
              {selected &&
              <View style={{ ...styles.countBadge, backgroundColor: badgeColor }}>
                <Text style={styles.countBadgeText}>{selectedItemCount}</Text>
              </View>
              }
            </ImageBackground>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center'
  },
  countBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto'
  }
})
