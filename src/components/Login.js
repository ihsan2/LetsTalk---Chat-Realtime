import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';
import {Label, Item, Input, Button, Toast} from 'native-base';
import {Divider} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import firebase from '../../config/firebase';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoad: false,
    };
  }

  handleBackButton = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleLogin = () => {
    this.setState({isLoad: true});
    const {email, password} = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Toast.show({
          text: 'Success: Anda Berhasil Login',
          buttonText: 'OK',
          type: 'success',
        });
        this.props.navigation.navigate('Home');
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
              <Text style={styles.txSignIn}>Sign In</Text>
            </View>
            <View>
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
            <View style={styles.forgot}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Forgot')}>
                <Text style={styles.txForgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewBottom}>
              <Button
                style={styles.btnSign}
                onPress={this.handleLogin.bind(this)}>
                {this.state.isLoad ? (
                  <ActivityIndicator color={'#fff'} />
                ) : (
                  <Text style={styles.txSign}>Sign In</Text>
                )}
              </Button>
            </View>
            <View style={styles.div}>
              <Divider style={styles.div1} />
              <Text style={styles.txdiv}>Or Sign In With</Text>
              <Divider style={styles.div2} />
            </View>
            <View style={styles.viewBottom}>
              <Button style={styles.btnGoogle}>
                <Image
                  style={styles.logoG}
                  source={{
                    uri:
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png',
                  }}
                />
                <Text style={styles.txGoogle}>Google</Text>
              </Button>
            </View>
            <View style={styles.bottom}>
              <Text style={styles.txSignup1}>Don't Have an Account?</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Register')}>
                <Text style={styles.txSignup2}>Sign Up</Text>
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
    marginTop: hp('0%'),
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
  div: {
    flex: 1,
    flexDirection: 'row',
    marginTop: hp('2%'),
    justifyContent: 'center',
  },
  div1: {
    width: wp('27.5%'),
    height: hp('0.2%'),
    marginRight: wp('5%'),
    marginTop: hp('1%'),
  },
  div2: {
    width: wp('27.5%'),
    height: hp('0.2%'),
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
  },
  txdiv: {
    color: '#8d8daa',
  },
  logoG: {
    width: wp('10.6%'),
    height: hp('5.5%'),
    marginLeft: wp('5%'),
  },
  forgot: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    marginLeft: wp('7%'),
    marginRight: wp('7%'),
    justifyContent: 'flex-end',
  },
  txForgot: {
    fontSize: wp('4%'),
    color: '#8d8daa',
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

export default withNavigation(Login);
