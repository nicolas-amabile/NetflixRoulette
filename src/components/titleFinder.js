import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
  Picker,
  Slider
} from 'react-native'
import Header from '../components/header'
import Tab from '../components/tab'
import * as Constants from '../constants'

function getImageURL (id) {
  return `${Constants.BASE_IMAGE_URL}/${id}/${Constants.IMAGE_POSTFIX}`
}

function getRecommendationUrl ({activeTab, minimumScore}) {
  let params = ''
  let modifieldFilter = Object.assign({}, Constants.BASE_OPTIONS)
  modifieldFilter.kind = activeTab === 'TV Shows' ? 1 : 2
  modifieldFilter.minimumScore = minimumScore

  const keys = Object.keys(modifieldFilter)
  keys.forEach((key, index) => {
    params += `${key}=${modifieldFilter[key]}`
    if (index < keys.length - 1) {
      params += '&'
    }
  })
  return Constants.BASE_RECOMMENDATION_URL + params
}

const Recommendation = ({id, has_poster, title, imdb_rating, released_on, overview}) => {
  const uri = getImageURL(id)

  renderImage = () => {
    if (has_poster) {
      return (
        <Image
          key='image'
          source={{uri}}
          style={{resizeMode: 'stretch', height: 400}} />
      )
    }
  }

  return [
    <Text key='title'> {title} </Text>,
    this.renderImage(),
    <Text key='rating'> {`IMDB: ${imdb_rating}`} </Text>,
    <Text key='year'> {new Date(released_on).getFullYear()} </Text>,
    <Text key='overview'> {overview} </Text>
  ]
}

const TypeSelector = ({activeTab, onTabPress}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Tab 
        name='TV Shows' 
        isActive={activeTab === 'TV Shows'} 
        onPress={onTabPress}
      />
      <Tab 
        name='Movies' 
        isActive={activeTab === 'Movies'}
        onPress={onTabPress}
      />
    </View>
  )
}

export default class TitleFinder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      error: null,
      data: null,
      minimumScore: 0,
      activeTab: 'Movies'
    }
  }

  reset () {
    this.setState({
      loading: false,
      error: false,
      data: null,
      minimumScore: 0,
      activeTab: 'TV Shows'
    })
  }

  renderRecommendation (recommendation) {
    const { id } = recommendation
    return (
      <ScrollView>
        <Recommendation {...recommendation} />
        {this.renderSpinButton()}
        {this.renderResetButton()}
      </ScrollView>
    )
  }

  renderSpinButton () {
    const buttonText = this.state.data ? 'Spin again!' : 'Spin!'
    return (
      <Button
        onPress={this.fetchData.bind(this)}
        title={buttonText} />
    )
  }

  renderResetButton () {
    return (
      <Button
        onPress={this.reset.bind(this)}
        title='Reset filters!' />
    )
  }

  renderScorePicker () {
    const scoreToDisplay = this.state.minimumScore === 0 ? 'Any' : `More than ${this.state.minimumScore}`
    return [
      <Text key='scoreLabel'> IMDB minimum score: </Text>,
      <Slider
        key='scorePicker'
        step={1}
        minimumValue={0}
        maximumValue={9}
        onValueChange={(newValue) => this.setState({minimumScore: newValue})}
        value={this.state.minimumScore}
      />,
      <Text key='scoreValue'> {scoreToDisplay} </Text>
    ]
  }

  renderType () {
    return (
      <TypeSelector
        activeTab={this.state.activeTab}
        onTabPress={this.onTabPress} />
    )
  }

  renderForm () {  
    return (
      <View style={styles.container}>
        <Header title='Suggest me a title' />
        {this.renderType()}
        {this.renderScorePicker()}
        {this.renderSpinButton()}
      </View>
    )
  }

  onTabPress = tab => {
    this.setState({ activeTab: tab })
  }

  render() {
    const { loading, data, error, activeTab } = this.state
    let content
    if (data) {
      return this.renderRecommendation(data)
    } else if (loading) {
      content = <Text> Loading ... </Text>
    } else if (error) {
      content = <Text> Ops! </Text>
    } else {
      content = this.renderForm()
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    )
  }

  fetchData () {
    const { activeTab, minimumScore } = this.state
    const url = getRecommendationUrl({activeTab, minimumScore})
    this.setState({
      loading: true,
      data: null,
      error: false
    }, () => {
      fetch(url)
      .then((recommendationResponse) => recommendationResponse.json())
      .then((recommendationJSON) => {
        this.setState({
          data: recommendationJSON,
          error: false,
          loading: false
        })     
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: true,
          data: null
        })
      })
    })
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginVertical: 40,
    // marginHorizontal: 20
  },
})
