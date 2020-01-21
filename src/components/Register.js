import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';
import {Label, Item, Input, Button, Toast} from 'native-base';
import {withNavigation} from 'react-navigation';
import firebase from '../../config/firebase';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      isLoad: false,
    };
  }

  handleRegister = () => {
    this.setState({isLoad: true});
    const {email, password, name} = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const userId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref('users/' + userId)
          .set({
            name,
            email,
            image:
              'https://firebasestorage.googleapis.com/v0/b/tesrn-f0beb.appspot.com/o/images%2Fprofile%2FRecruitee-logo-v2.png?alt=media&token=9317a47a-e6f5-48c8-b2b2-4fcd9e2c0b40',
          });
        Toast.show({
          text: 'Success: Anda Berhasil Register',
          buttonText: 'OK',
          type: 'success',
        });
        this.props.navigation.push('Login');
        this.setState({isLoad: false});
      })
      .catch(err => {
        Toast.show({
          text: `${err}`,
          buttonText: 'OK',
          type: 'danger',
        });
        this.setState({isLoad: false});
      });
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <ScrollView>
            <View style={styles.vImage}>
              <Image source={require('../public/logo-app.png')} />
              <Text style={styles.txSignIn}>Sign Up</Text>
            </View>
            <View>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.lbEmail}>Name</Label>
                <Input
                  placeholder="Nur Ihsan"
                  style={styles.inEmail}
                  onChangeText={name => {
                    this.setState({
                      name,
                    });
                  }}
                  value={this.state.name}
                />
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.lbEmail}>Email</Label>
                <Input
                  placeholder="example@mail.com"
                  keyboardType="email-address"
                  style={styles.inEmail}
                  onChangeText={email => {
                    this.setState({
                      email,
                    });
                  }}
                  value={this.state.email}
                />
              </Item>
              <Item stackedLabel style={styles.item}>
                <Label style={styles.lbPass}>Password</Label>
                <Input
                  placeholder="******"
                  secureTextEntry={true}
                  style={styles.inPass}
                  onChangeText={password => {
                    this.setState({
                      password,
                    });
                  }}
                  value={this.state.password}
                />
              </Item>
            </View>
            <View style={styles.viewBottom}>
              <Button
                style={styles.btnSign}
                onPress={this.handleRegister.bind(this)}>
                {this.state.isLoad ? (
                  <ActivityIndicator color={'#fff'} />
                ) : (
                  <Text style={styles.txSign}>Sign Up</Text>
                )}
              </Button>
            </View>
            <View style={styles.bottom}>
              <Text style={styles.txSignup1}>Have an Account?</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login')}>
                <Text style={styles.txSignup2}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  vImage: {
    flex: 1,
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  txSignIn: {
    marginTop: hp('1%'),
    fontSize: wp('13%'),
    color: '#8d8daa',
    fontWeight: '200',
  },
  item: {
    marginLeft: wp('7%'),
    marginRight: wp('7%'),
    marginTop: hp('2.5%'),
  },
  lbEmail: {
    alignSelf: 'flex-start',
  },
  lbPass: {
    alignSelf: 'flex-start',
  },
  viewBottom: {
    marginTop: hp('2%'),
    marginLeft: wp('7%'),
    marginRight: wp('7%'),
  },
  btnSign: {
    backgroundColor: '#0E8ED4',
    borderRadius: wp('2%'),
    justifyContent: 'center',
    height: hp('7%'),
  },
  btnGoogle: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    height: hp('7%'),
    borderColor: '#8d8daa',
    borderWidth: wp('0.2%'),
  },
  txSign: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: '800',
  },
  txGoogle: {
    fontSize: wp('5%'),
    color: '#8d8daa',
    fontWeight: '900',
    marginRight: wp('35.5%'),
  },
  logoG: {
    width: wp('10.6%'),
    height: hp('5.5%'),
    marginLeft: wp('5%'),
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('5%'),
  },
  txSignup1: {
    fontSize: wp('4.5%'),
    color: '#8d8daa',
    alignSelf: 'flex-start',
  },
  txSignup2: {
    fontSize: wp('4.5%'),
    color: '#8d8daa',
    textDecorationLine: 'underline',
    marginLeft: wp('1%'),
  },
});

export default withNavigation(Register);
