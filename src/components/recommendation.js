import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  View
} from 'react-native'
import { getImageURL, getRecommendationUrl } from '../utils'
import defaultImage from '../../images/defaultImage.png'

class Recommendation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errorOnImageLoad: false,
      loading: true
    }
  }

  renderImage = () => {
    if (this.props.has_poster) {
      const uri = getImageURL(this.props.id)
      const { errorOnImageLoad, loading } = this.state
      
      let source
      if (errorOnImageLoad) {
        source = defaultImage
      } else {
        source = { uri }
      }

      return (
        <View style={styles.container}>
          <View style={styles.indicatorContainer}>
            <ActivityIndicator size='small' animating={this.state.loading} />
          </View>
          <Image
            onLoadStart={() => { this.setState({loading: true})}}
            onLoadEnd={() => { this.setState({loading: false})}}
            onError={() => { this.setState({errorOnImageLoad: true})}}
            source={source}
            style={styles.image}
            resizeMode='contain'/>
        </View>
      )
    }
  }

  render () {
    const {id, has_poster, title, imdb_rating, released_on, overview} = this.props

    return (
      <React.Fragment>
        <Text key='title' style={styles.title}> {title} </Text>
        {this.renderImage()}
        <Text key='info' style={[styles.info, styles.text]}>
          {`IMDB: ${imdb_rating} - ${new Date(released_on).getFullYear()}`}
        </Text>
        <Text key='overview' style={[styles.overview, styles.text]}>
          {overview}
        </Text>
      </React.Fragment> 
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  info: {
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginVertical: 15
  },
  text: {
    marginHorizontal: 15,
    marginVertical: 5
  },
  overview: {
    marginBottom: 5,
    fontWeight: '100'
  },
  container: {
    flex: 1,
    height: 400,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    flex: 1,
    width: '100%'
  },
  indicatorContainer: {
    position:'absolute'
  }
})

export default Recommendation
