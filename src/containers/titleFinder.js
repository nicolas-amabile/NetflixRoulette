import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
  Picker,
  Switch
} from 'react-native'
import Header from '../components/header'
import Tab from '../components/tab'
import * as Constants from '../constants'

export default class TitleFinder extends Component {
  state = {
    loading: false,
    error: null,
    data: null,
    searchForTVShows: true,
    minimumScore: 0,
    activeTab: 'movies'
  }

  reset () {
    this.setState({
      loading: false,
      error: false,
      data: null,
      searchForTVShows: true,
      minimumScore: 0
    })
  }

  renderRecommendation (recommendation) {
    const { id, title, imdb_rating, overview, has_poster, released_on } = recommendation
    const uri = this.getImageURL(id)
    return (
      <ScrollView>
        <Text> {title} </Text>
        {has_poster && <Image
          source={{uri}}
          style={{resizeMode: 'stretch', height: 400}} />}
        <Text> {`IMDB: ${imdb_rating}`} </Text>
        <Text> {new Date(released_on).getFullYear()} </Text>
        <Text> {overview} </Text>
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
    const scoreItems = [
      <Picker.Item key={0} label='Any Score' value={0} />
    ]
    for(let score = 1; score<=Constants.MAX_SCORE; score++) {
      scoreItems.push(
        <Picker.Item key={score} label={`>${score}`} value={score} />
      )
    }

    return [
      <Text key='scoreLabel'> Score: </Text>,
      <Picker
        key='scorePicker'
        selectedValue={this.state.minimumScore}
        style={{width: 100}} 
        onValueChange={(itemValue, itemIndex) => this.setState({minimumScore: itemValue})}>
        {scoreItems}
      </Picker>
    ]
  }

  renderTypeSwitch () {
    return [
      <Text key='typeLabel'> TV Shows or Movies? </Text>,
      <Switch 
        key='typeSwitch'
        onValueChange={ (value) => this.setState({ searchForTVShows: value })} 
        value={ this.state.searchForTVShows } 
      />,
      <Text key='typeValue'> {this.state.searchForTVShows ? 'TV Shows' : 'Movies'} </Text>
    ]
  }

  renderForm () {  
    return (
      <View style={styles.container}>
        {this.renderTypeSwitch()}
        {this.renderScorePicker()}
        {this.renderSpinButton()}
      </View>
    )
  }

  onTabPress = tab => {
    this.setState({ activeTab: tab })
  }

  render() {
    const { loading, data, error } = this.state
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

    const { activeTab } = this.state

    return (
      <View style={styles.container}>
        {!data ? (
          <View>
            <Header title="Suggest me a title" />
            <View style={{ flexDirection: 'row' }}>
              <Tab 
                name="movies" 
                isActive={activeTab === "movies"}
                onPress={this.onTabPress}
              />
              <Tab 
                name="series" 
                isActive={activeTab === "series"} 
                onPress={this.onTabPress}
              />
            </View>
            {content}
          </View>
        ) : (
          {content}
        )}
      </View>
    )
  }

  getRecommendationUrl () {
    let params = ''
    let modifieldFilter = Object.assign({}, Constants.BASE_OPTIONS)
    modifieldFilter.kind = this.state.searchForTVShows ? 1 : 2
    modifieldFilter.genre = this.state.genre
    modifieldFilter.minimumScore = this.state.minimumScore

    const keys = Object.keys(modifieldFilter)
    keys.forEach((key, index) => {
      params += `${key}=${modifieldFilter[key]}`
      if (index < keys.length - 1) {
        params += '&'
      }
    })
    return Constants.BASE_RECOMMENDATION_URL + params
  }

  getImageURL (id) {
    return `${Constants.BASE_IMAGE_URL}/${id}/${Constants.IMAGE_POSTFIX}`
  }

  fetchData () {
    const url = this.getRecommendationUrl()
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
