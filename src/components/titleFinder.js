import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
  Slider,
  ActivityIndicator
} from 'react-native'
import Header from '../components/header'
import Tab from '../components/tab'
import Recommendation from '../components/recommendation'
import * as Constants from '../constants'
import { getRecommendationUrl } from '../utils'

const TypeSelector = ({activeTab, onTabPress}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Tab 
        name={Constants.TV_SHOWS} 
        isActive={activeTab === Constants.TV_SHOWS}
        onPress={onTabPress}
      />
      <Tab 
        name={Constants.MOVIES} 
        isActive={activeTab === Constants.MOVIES}
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
      activeTab: Constants.TV_SHOWS
    }
  }

  reset () {
    this.setState({
      loading: false,
      error: false,
      data: null,
      minimumScore: 0,
      activeTab: Constants.TV_SHOWS
    })
  }

  renderRecommendation (recommendation) {
    const { id } = recommendation
    return (
      <ScrollView style={styles.recommendationContainer}>
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
    return (
      <React.Fragment> 
        <Text key='scoreLabel' style={styles.scoreLabel}> IMDB score: </Text>
        <Slider
          key='scorePicker'
          step={1}
          minimumValue={0}
          maximumValue={9}
          onValueChange={(newValue) => this.setState({minimumScore: newValue})}
          value={this.state.minimumScore}
          style={styles.scoreSlider}
        />
        <Text key='scoreValue' style={styles.scoreValue}> {scoreToDisplay} </Text>
      </React.Fragment>
    )
  }

  renderType () {
    return (
      <TypeSelector
        activeTab={this.state.activeTab}
        onTabPress={this.onTabPress} />
    )
  }

  renderSpamMessageQueueButton () {
    // return (
    //   <Button
    //     title='Spam!'
    //     onPress={() => {
    //       this.actBussyFor(80000)
    //     }} />
    // )
  }

  actBussyFor (milliseconds) {
    const start = new Date().getTime()
    for (let i=0; i< 1e7; i++) {
      let now = new Date().getTime()
      if ((now - start) > milliseconds) {
        break
      }
    }
  }

  renderForm () {  
    return (
      <View style={styles.container}>
        <Header title='Suggest me a title' />
        {this.renderType()}
        {this.renderScorePicker()}
        {this.renderSpinButton()}
        {this.renderSpamMessageQueueButton()}
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
      content = <ActivityIndicator size='large'/>
    } else if (error) {
      content = <Text> Ops! </Text>
    } else {
      content = this.renderForm()
    }
    
    return (
      <View style={loading ? styles.loaderContainer : styles.container}>
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
  scoreLabel: {
    paddingTop: 20,
    paddingLeft: 10
  },
  scoreValue: {
    textAlign: 'center',
    marginBottom: 10
  },
  scoreSlider: {
    margin: 10
  },
  loaderContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  recommendationContainer: {
    marginBottom: 10
  }
})
