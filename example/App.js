import React from 'react'
import { StyleSheet, Text, View, Button, ScrollView, Image } from 'react-native'

import { Permissions } from 'expo'

// import ImageBrowser from './components/ImageBrowser'
import { ImageBrowser } from 'expo-multiple-media-imagepicker'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageBrowserOpen: false,
      photos: []
    }
  }

  async componentDidMount () {
    Permissions.askAsync(Permissions.CAMERA_ROLL).then(d => console.log(d))
  }

  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      console.log(photos)
      this.setState({
        imageBrowserOpen: false,
        photos
      })
    }).catch((e) => console.log(e))
  }

  renderImage (item, i) {
    return (
      <Image
        style={{ height: 100, width: 100 }}
        source={{ uri: item.uri }}
        key={i}
      />
    )
  }

  render () {
    if (this.state.imageBrowserOpen) {
      return (
        <ImageBrowser
        max={101} // Maximum number of pickable image. default is None
        headerCloseText={'キャンセル'} // Close button text on header. default is 'Close'.
        headerDoneText={'　　完了'} // Done button text on header. default is 'Done'.
        headerButtonColor={'#E31676'} // Button color on header.
        headerSelectText={'枚の画像を選択中'} // Word when picking.  default is 'n selected'.
        mediaSubtype={'screenshot'} // Only iOS, Filter by MediaSubtype. default is display all.
        badgeColor={'#E31676'} // Badge color when picking.
        emptyText={'選択できる画像がありません'} // Empty Text
        callback={this.imageBrowserCallback} // Callback functinon on press Done or Cancel Button. Argument is Asset Infomartion of the picked images wrapping by the Promise.
          />
      )
    }

    return (
      <View style={styles.container}>
        <Button
          title='Choose Images'
          onPress={() => this.setState({ imageBrowserOpen: true })}
        />
        <Text>This is an example of a</Text>
        <Text>multi image selector using expo</Text>
        <ScrollView>
          {this.state.photos.map((item, i) => this.renderImage(item, i))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  }
})
