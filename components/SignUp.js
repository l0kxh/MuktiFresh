import { Text, View, ImageBackground, TextInput, Alert } from 'react-native'
import React, { Component, createRef, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { API_URL } from '../Init'
import { Button } from '@rneui/themed'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { connect } from 'react-redux'
import { login } from "../redux/actions"
import Spinner from 'react-native-loading-spinner-overlay'
export class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'form',
      name: '',
      phone: '',
      email: '',
      password: '',
      confirm_password: '',
      ref_code: '',
      otp: '',
      error: '',
      submitDisabled: false,
      holdEmail: '',
      holdPassword: ''
    }
    this.name_ref = React.createRef();
    this.phone_ref = React.createRef();
    this.email_ref = React.createRef();
    this.password_ref = React.createRef();
    this.confirm_password_ref = React.createRef();
    this.ref_code_ref = React.createRef();

    this.navigation = this.props.navigation;
  }

  ValidateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


  SendOTP = async (email) => {
    this.setState({ holdEmail: email });
    try {
      const data = new FormData();
      data.append('c_email', email);
      await axios({
        method: 'POST',
        url: API_URL + 'sendOtp',
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        //console.log(res);
      }).catch(err => {
        console.log(err)
      })
    } catch (error) {
      console.log(error);
    }
  }

  Continue = async () => {
    this.setState({ loading: true });
    this.setState({ submitDisabled: true });
    this.setState({ error: '' })
    if (this.state.name.length != 0 && this.state.phone.length != 0 && this.state.email.length != 0 &&
      this.state.password.length != 0 && this.state.confirm_password.length != 0) {
      if (this.ValidateEmail(this.state.email)) {
        //check if password is atleast 5 digits
        if (this.state.password.length >= 5) {
          //check if both passwords are correct 
          if (this.state.password == this.state.confirm_password) {
            //Process forms
            this.setState({ holdPassword: this.state.password });
            const form = new FormData();
            form.append('name', this.state.name);
            form.append('email', this.state.email);
            form.append('referral_code', this.state.ref_code);
            form.append('password', this.state.password);
            form.append('mobile', this.state.phone);
            const self = this;
            try {
              await axios({
                method: 'POST',
                url: API_URL + "register",
                data: form,
                headers: { "Content-Type": "multipart/form-data" },
              }).then(async function (res) {
                await self.SendOTP(self.state.email);
                self.setState({ submitDisabled: false });
                self.setState({ screen: 'OTP' });
                self.setState({ name: '' })
                self.setState({ email: '' })
                self.setState({ ref_code: '' })
                self.setState({ password: '' })
                self.setState({ confirm_password: '' })
                self.setState({ mobile: '' })
              }).catch(err => {
                console.log(err);
              })
            } catch (err) {
              console.log(err);
            }
          } else {
            this.setState({ submitDisabled: false });
            this.setState({ error: 'Password does not matched' });
          }
        } else {
          this.setState({ submitDisabled: false });
          this.setState({ error: 'Enter a password of at least 5 characters' })
        }
      } else {
        this.setState({ submitDisabled: false });
        this.setState({ error: 'Enter a valid email address' })
      }
    } else {
      this.setState({ submitDisabled: false });
      this.setState({ error: 'Please fill all the required details' })
    }
    this.setState({ loading: false });
  }

  ValidateOTP = async (email, otp) => {
    this.setState({loading:true});
    try {
      const data = new FormData();
      data.append('c_email', email);
      data.append('otp', otp);
      await axios({
        method: 'POST',
        url: API_URL + 'validateOtp',
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(async(res) => {
        if (res.data.response == 'success') {
          console.log(res.data);
          await this.props.login(this.state.holdEmail, this.state.holdPassword);
          this.setState({ loading: false });
          this.props.navigation.navigate('Account')
        } else {
          this.setState({ loading: false });
          Alert.alert('Failed', res.data.message);
        }
      }).catch(err => {
        console.log(err)
      })
    } catch (error) {
      console.log(error);
    }
    this.setState({loading:false});
  }
  Submit = () => {
    if (this.state.otp.length == 6) {
      this.ValidateOTP(this.state.holdEmail, this.state.otp);
    } else {
      this.setState({ error: 'Enter a valid OTP' })
    }
  }
  Form = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 35, color: '#000000', marginBottom: 15 }}>Register</Text>
        <TextInput ref={this.name_ref} onSubmitEditing={() => this.phone_ref.current.focus()} value={this.state.name} onChangeText={(val) => this.setState({ name: val })} style={{ color: '#328616', padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 15, borderRadius: 5 }} placeholder='Enter Full Name' />
        <TextInput ref={this.phone_ref} keyboardType='phone-pad' maxLength={10} onSubmitEditing={() => this.email_ref.current.focus()} value={this.state.phone} onChangeText={(val) => this.setState({ phone: val })} style={{ color: '#328616', padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 10, borderRadius: 5 }} placeholder='Enter Phone Number' />
        <TextInput ref={this.email_ref} keyboardType='email-address' onSubmitEditing={() => this.ref_code_ref.current.focus()} value={this.state.email} onChangeText={(val) => this.setState({ email: val })} style={{ color: '#328616', padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 10, borderRadius: 5 }} placeholder='Enter Email Address' />
        <TextInput ref={this.ref_code_ref} onSubmitEditing={() => this.password_ref.current.focus()} value={this.state.ref_code} onChangeText={(val) => this.setState({ ref_code: val })} style={{ color: '#328616', padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 10, borderRadius: 5 }} placeholder='Enter referral code if any' />
        <TextInput ref={this.password_ref} secureTextEntry={true} onSubmitEditing={() => this.confirm_password_ref.current.focus()} value={this.state.password} onChangeText={(val) => this.setState({ password: val })} style={{ color: '#328616', padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 10, borderRadius: 5 }} placeholder='Enter Password' />
        <TextInput ref={this.confirm_password_ref} secureTextEntry={true} value={this.state.confirm_password} onChangeText={(val) => this.setState({ confirm_password: val })} style={{ color: '#328616', padding: 10, borderWidth: 1, borderColor: '#ebebeb', marginTop: 10, borderRadius: 5 }} placeholder='Confirm Password' />
        <Text style={{ color: '#ff0000', marginTop: 8 }}>{this.state.error}</Text>
        <Button disabled={this.state.submitDisabled} onPress={this.Continue} type='solid' color='#328616' containerStyle={{ marginTop: 10 }} buttonStyle={{ padding: 14, borderRadius: 5 }}>Continue</Button>
        <Button onPress={() => { this.props.navigation.navigate('SignIn'); }} type='outline' color='#328616' containerStyle={{ marginTop: 10 }} titleStyle={{ color: '#328616' }} buttonStyle={{ padding: 14, borderRadius: 5, borderColor: '#328616' }}>Already have account?</Button>
      </View>
    )
  }
  OTP = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 35, color: '#000000', marginBottom: 15 }}>OTP</Text>
        <Text style={{ color: '#a1a1a1', textAlign: 'center', marginBottom: 10 }}>We have just send an 6 digit one time password to your registered phone number ending ******{this.state.phone.substring(this.state.phone.length-4)}</Text>
        <TextInput onChangeText={(val) => { this.setState({ otp: val }) }} maxLength={6} keyboardType='numeric' secureTextEntry={true} style={{ padding: 10, borderWidth: 1, borderColor: '#ffffff', fontSize: 22, borderBottomColor: '#a1a1a1', marginTop: 15, textAlign: 'center' }} placeholder='Enter OTP' />
        <Text style={{ color: '#ff0000', marginTop: 8 }}>{this.state.error}</Text>
        <Button disabled={this.state.submitDisabled} onPress={this.Submit} type='solid' color='#328616' containerStyle={{ marginTop: 10 }} buttonStyle={{ padding: 14, borderRadius: 5 }}>Submit</Button>
      </View>
    )
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Spinner visible={this.state.loading}/>
        <ImageBackground style={{ flex: 1, resizeMode: 'cover' }} source={require('../assets/login_bg.png')}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 15 }}>
            {
              (this.state.screen == 'form') ? <this.Form /> : <this.OTP />
            }
          </View>
        </ImageBackground>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLogin: state.isLogin,
})
export default connect(mapStateToProps, {login})(SignUp)