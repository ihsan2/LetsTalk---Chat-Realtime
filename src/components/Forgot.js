import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';
import {Label, Item, Input, Button, Toast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from 'react-navigation';
import firebase from '../../config/firebase';

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isLoad: false,
    };
  }

  sendVerification = () => {
    this.setState({isLoad: true});
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        Toast.show({
          text: 'Success: Silahkan Cek Email Anda',
          buttonText: 'OK',
          type: 'success',
        });
        this.props.navigation.navigate('Login');
        this.setState({isLoad: false, email: ''});
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
              <Text style={styles.txSignIn}>Reset Password</Text>
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
            </View>

            <View style={styles.viewBottom}>
              <Button
                style={styles.btnSign}
                onPress={this.sendVerification.bind(this)}>
                {this.state.isLoad ? (
                  <ActivityIndicator color={'#fff'} />
                ) : (
                  <Text style={styles.txSign}>Send Email Verification</Text>
                )}
              </Button>
            </View>
          </ScrollView>
          <View style={styles.icon}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Icon name="angle-left" size={25} color={'#000'} />
            </TouchableOpacity>
          </View>
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
    marginTop: hp('10%'),
  },
  icon: {
    position: 'absolute',
    marginTop: hp('2%'),
    marginLeft: wp('5%'),
  },
  txSignIn: {
    marginTop: hp('5%'),
    fontSize: wp('10%'),
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
  txSign: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: '800',
  },
});

export default withNavigation(Forgot);
