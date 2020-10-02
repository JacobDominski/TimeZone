import { StatusBar } from 'expo-status-bar';
import { ImageBackground, LogBox } from 'react-native';
import PickerBox from 'react-native-picker-box';
import React, {Component, useState} from 'react';
import { StyleSheet, Text, View, } from 'react-native';

var time = new Date()
var offset = time.getTimezoneOffset()/60

export default class App extends Component{

  state={
    timezone: [
      {label: 'Universal Time', value: 'Universal Time Coordinated'},
      {label: 'Current Time', value: 'Current User Time'},
      {label: 'Japan', value: 'Japan Standard Time'},
      {label: 'Los Angeles', value: 'Pacific Time'},
      {label: 'London', value: 'British Summer Time'},
      {label: 'New York', value: 'Eastern Time'}, 
      {label: 'Moscow, Russia', value: 'Moscow Standard Time'},
      {label: 'Hawaii', value: 'Hawaii-Aleutian Standard Time'}, 
      {label: 'Dallas, Texas', value: 'Central Time'},
      {label: 'China', value: 'China Standard Time'},

    ],
    selectedValue: 'Universal Time',
    time: '',
    offset: offset,
    image: require('./assets/sunrise.jpg'),
  }

  changeTime(date, timezone){
    let stdTime = []
    //current hour + offset gets the UTC standard
    

    switch(timezone){
      case 'Japan':
        this.setState({offset: (offset+9)})
        break;
      case 'Los Angeles':
        this.setState({offset: (offset-7)})
        break;
      case 'London':
        this.setState({offset: (offset+1)})
        break;
      case 'New York':
        this.setState({offset: (offset-4)})
        break;
      case 'Moscow, Russia':
        this.setState({offset: (offset+3)})
        break;
      case 'Hawaii':
        this.setState({offset: (offset-10)})
        break;
      case 'Dallas, Texas':
        this.setState({offset: (offset-5)})
        break;
      case 'China':
        this.setState({offset: (offset+8)})
        break;
      case 'Current Time':
        this.setState({offset: 0})
        break;
      default:
        this.setState({offset: offset})
        break;
    }
    stdTime = this.convertStandardTime(date, this.state.offset)
    this.setState({ selectedValue: timezone })
    this.setState({ time: stdTime[0] + ":" + stdTime[1] + stdTime[2]})
    
  }

  convertStandardTime(date, offset){
    
    let meridiem = ''
    let hours = date.getHours() + offset
    let minutes = date.getMinutes()

    if(hours > 24){
      hours -= 24
    }
    
    if(hours >= 5 && hours < 7)
    {
      this.setState({image: require('./assets/sunrise.jpg')})
    }
    else if(hours >= 7 && hours < 10)
    {
      this.setState({image: require('./assets/morning.jpg')})
    }
    else if(hours >= 10 && hours < 17)
    {
      this.setState({image: require('./assets/afternoon.jpg')})
    }
    else if(hours >= 17 && hours < 20)
    {
      this.setState({image: require('./assets/evening.jpg')})
    }
    else
    {
      this.setState({image: require('./assets/night.jpg')})
    }

    if(hours > 12){
      hours -= 12
      meridiem = ' PM'
    }else{
      meridiem = ' AM'
    }

    if(date.getMinutes() < 10){
      minutes = '0'+minutes
    }
    return [hours, minutes, meridiem]
  }

  componentDidMount(){
    setInterval(()=>{
      time = new Date()
      newTime = this.convertStandardTime(time, this.state.offset)
      this.setState({
        time: newTime[0] + ":" + newTime[1] + newTime[2]
      })
    }, 200)
  }

  render(){
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
    
    return (
      
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          resizeMode='cover'
          source={this.state.image}
        >
          <Text style={styles.times}>{ this.state.selectedValue } - { this.state.time }</Text>
          <Text style={{color: '#000', fontSize: 20}}>──────────────────</Text>
          <Text style={styles.button} onPress={() => this.myref.openPicker() }>Select a Time Zone</Text>
          
          
          <PickerBox
            ref={ref => this.myref = ref}
            data={ this.state.timezone }
            onValueChange={value => {

              this.setState({ selectedValue: value })
              this.changeTime(time, value)
              
            }}
            selectedValue={ this.state.selectedValue }
          />
        </ImageBackground>
        
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  button: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
  times: {
    fontSize: 30,
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});