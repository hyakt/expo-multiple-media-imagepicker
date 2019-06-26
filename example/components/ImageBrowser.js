import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Button
} from 'react-native'

import * as MediaLibrary from 'expo-media-library'

import ImageTile from './ImageTile'

const { width } = Dimensions.get('window')

export default class ImageBrowser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      photos: [],
      selected: [],
      after: null,
      hasNextPage: true
    }
  }

  componentDidMount () {
    this.getPhotos()
  }

  selectImage = (index) => {
    let newSelected = Array.from(this.state.selected)

    if (newSelected.indexOf(index) === -1) {
      newSelected.push(index)
    } else {
      const deleteIndex = newSelected.indexOf(index)
      newSelected.splice(deleteIndex, 1)
    }

    if (newSelected.length > this.props.max) return
    if (newSelected.length === 0) newSelected = []

    this.setState({ selected: newSelected })
  }

  getPhotos = () => {
    let params = { first: 500, mimeTypes: ['image/jpeg'] }
    if (this.state.after) params.after = this.state.after
    if (!this.state.hasNextPage) return
    MediaLibrary
      .getAssetsAsync(params)
      .then((assets) => this.processPhotos(assets))
  }

  processPhotos = (assets) => {
    if (this.state.after === assets.endCursor) return
    this.setState({
      photos: [...this.state.photos, ...assets.assets],
      after: assets.endCursor,
      hasNextPage: assets.hasNextPage
    })
  }

  getItemLayout = (data, index) => {
    let length = width / 4
    return { length, offset: length * index, index }
  }

  prepareCallback = () => {
    let { selected, photos } = this.state
    let selectedPhotos = photos.filter((item, index) => {
      return (selected[index])
    })
    let files = selectedPhotos
        .map(i => FileSystem.getInfoAsync(i, { md5: true }))
    let callbackResult = Promise
        .all(files)
        .then(imageData => {
          return imageData.map((data, i) => {
            return { file: selectedPhotos[i], ...data }
          })
        })
    this.props.callback(callbackResult)
  }

  renderHeader = () => {
    let selectedCount = this.state.selected.length
    let headerText = selectedCount + ' Selected'
    if (selectedCount === this.props.max) headerText = headerText + ' (Max)'
    return (
      <View style={styles.header}>
        <Button
          title='Close'
          onPress={() => this.props.callback(Promise.resolve([]))}
        />
        <Text>{headerText}</Text>
        <Button
          title='Done'
          onPress={() => this.prepareCallback()}
        />
      </View>
    )
  }

  renderImageTile = ({ item, index }) => {
    const selected = this.state.selected.indexOf(index) !== -1
    const selectedItemCount = this.state.selected.indexOf(index) + 1

    return (
      <ImageTile
        item={item}
        selectedItemCount={selectedItemCount}
        index={index}
        camera={false}
        selected={selected}
        selectImage={this.selectImage}
      />
    )
  }

  renderImages = () => {
    return (
      <FlatList
        data={this.state.photos}
        numColumns={4}
        renderItem={this.renderImageTile}
        keyExtractor={(_, index) => index}
        onEndReached={() => { this.getPhotos() }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>Loading...</Text>}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
      />
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderImages()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 60,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 30
  }
})
