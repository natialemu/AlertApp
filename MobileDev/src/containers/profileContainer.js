import { connect } from 'react-redux';
import React, {Component} from 'react';
import { View, Text,TextInput,AppRegistry,Image } from 'react-native';
import styles from '../../lib/resources/stylesheet';
import TouchableHightlight from '../components/touchableHighlight/touchableHighlight';
import Button from 'react-native-button';
import inputField from '../components/inputControls/inputField';
import TextField from 'react-native-md-textinput';
import gear from '../../lib/resources/img/gear.png';


const Profile = React.createClass({
  render () {
    return (

      <View style={styles.container}>
        <Text style={styles.header}>My Profile</Text>
         <View style={{flex:1, flexDirection: 'row'}}>
         <View style={{width: 150, height: 90}} />
          <View style={{width: 100, height: 90}} />
      <Image

        style={{ width: 100, height: 90 }}
        source={gear}
      />
      </View>

   <TextField label={'Name'} highlightColor={'#D35400'}/>
   <TextField label={'Password'} highlightColor={'#D35400'} />
   <TextField label={'Email'} highlightColor={'#D35400'} />

<Button
  containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
  style={{fontSize: 20, color: 'green'}}>
  Update
</Button>

      </View>
    );
  }
});


export default connect()(Profile);
