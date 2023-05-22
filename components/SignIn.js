import { Text, View, ImageBackground, TextInput, Alert } from 'react-native'
import React, { Component, createRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { API_URL } from '../Init'
import { Button } from '@rneui/themed'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {loadCart, login} from "../redux/actions"
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      submitButton: false,
      loading:false,
    }
    this.email_ref = React.createRef();
    this.password_ref = React.createRef();
    this.navigation = this.props.navigation;
    // this.UpdateLogin = this.props.route.params.UpdateLogin;
    // this.UpdateAuth = this.props.route.params.UpdateAuth;
  }

  // SaveLogin = async (data) => {
  //   try {
  //     await AsyncStorage.setItem('auth', JSON.stringify(data));
  //     AsyncStorage.setItem('rootUpdate', 'true');
  //     this.UpdateAuth(data);
  //     this.UpdateLogin(true);
  //     this.navigation.navigate('Account');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  AuthLogin = async () => {
    this.setState({ submitButton:true });
    this.setState({loading:true});
    if (this.state.email.length != 0 && this.state.password.length != 0) {
      await this.props.login(this.state.email,this.state.password);
      if(this.props.isLogin){
        await this.props.loadCart(this.props.auth.user_details.c_email)
        this.props.navigation.navigate('Shop')
      }
    } else {
      Alert.alert('Failed', 'Please enter valid email and password');
    }
    this.setState({ submitButton: false });
    this.setState({loading:false});
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Spinner visible={this.state.loading} />
        <ImageBackground style={{ flex: 1, resizeMode: 'cover' }} source={require('../assets/login_bg.png')}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 15 }}>
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}>
              <Text style={{ fontSize: 35, color: '#000000', marginBottom: 15 }}>SignIn</Text>
              <TextInput ref={this.email_ref} keyboardType='email-address' onSubmitEditing={() => { this.password_ref.current.focus(); }} value={this.state.email} onChangeText={(val) => this.setState({ email: val })} style={{ padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 15, borderRadius: 5 }} placeholder='Enter Email or Phone' />
              <TextInput ref={this.password_ref} secureTextEntry={true} value={this.state.password} onChangeText={(val) => this.setState({ password: val })} style={{ padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 10, borderRadius: 5 }} placeholder='Enter Password' />
              <Button disabled={this.state.submitButton}  onPress={() => { this.AuthLogin() }} type='solid' color='#328616' containerStyle={{ marginTop: 10 }} buttonStyle={{ padding: 14, borderRadius: 5 }}>Login</Button>
              <Button onPress={() => { this.props.navigation.navigate('SignUp'); }} type='outline' color='#328616' containerStyle={{ marginTop: 10 }} titleStyle={{ color: '#328616' }} buttonStyle={{ padding: 13, borderRadius: 5, borderColor: '#328616', borderWidth:1 }}>Register</Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}
const mapStateToProps = state=>({
  isLogin : state.isLogin,
  auth : state.auth
})
export default connect(mapStateToProps,{login, loadCart})(SignIn)