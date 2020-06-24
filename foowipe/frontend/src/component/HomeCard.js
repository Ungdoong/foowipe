import React, {Component} from 'react'
import {TouchableOpacity, StyleSheet, ImageBackground} from 'react-native'
import {Card, Text, Icon} from 'react-native-elements'

export default class HomeCard extends Component {
  state = {
    image: null,
  }

  componentDidMount () {
    switch (this.props.name) {
      case '카페':
        this.setState({image: require('frontend/assets/img/cafe_img.jpg')})
        return
      case '음식점':
        this.setState({image: require('frontend/assets/img/res_img.jpg')})
        return
      case '알코올':
        this.setState({image: require('frontend/assets/img/alcohol_img.jpg')})
        return
      default:
        return null
    }
  }

  render () {
    return (
      <Card containerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('FoodScreen', {
              type: this.props.name
            })
          }}>
          <ImageBackground source={this.state.image} style={styles.image} imageStyle={{borderRadius:20}}>
            <Text style={styles.text}>{this.props.name}</Text>
            <Icon
              name='chevron-right'
              type='material-community'
              size={40}
              color='white'
              containerStyle={styles.iconContainer}
            />
          </ImageBackground>
        </TouchableOpacity>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.33,
    margin: 0,
    padding: 0,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20
  },
  text: {
    fontFamily: '12lotteLight',
    fontSize: 45,
    color: 'white',
    opacity: 0.9,
    marginLeft: 20,
    marginLeft: 40,
    marginTop: 5,
  },
  image: {
    flexDirection: 'row',
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
  },
})
