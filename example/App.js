import React from 'react'
import { StyleSheet, Text, View, Button, ScrollView, Image } from 'react-native'

import { Permissions } from 'expo'

import ImageBrowser from './components/ImageBrowser'
// import { ImageBrowser } from 'expo-multiple-media-imagepicker'

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
        source={{ uri: item.file }}
        key={i}
      />
    )
  }

  render () {
    if (this.state.imageBrowserOpen) {
      return (<ImageBrowser max={101} badgeColor={'#E31676'} callback={this.imageBrowserCallback} />)
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
    marginTop: 30,
  }
})
