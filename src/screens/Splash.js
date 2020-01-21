import React from 'react';
import {StyleSheet, View, Image, Text, SafeAreaView} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import {withNavigation} from 'react-navigation';
import firebase from '../../config/firebase';
import {Toast} from 'native-base';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: true};
  }

  componentDidMount() {
    console.disableYellowBox = true;
    // setTimeout(() => {
    //   this.setState({
    //     visible: !this.state.visible,
    //   });
    //   if (user) {
    //     this.props.navigation.navigate('Home');
    //   } else {
    //     try {
    //       this.props.navigation.navigate('Login');
    //       Toast.show({
    //         text: 'Anda belum Login. Silahkan Login',
    //         buttonText: 'OK',
    //         type: 'info',
    //         duration: 5000,
    //       });
    //     } catch (err) {}
    //   }
    // }, 2500);

    setTimeout(() => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.props.navigation.navigate('Home');
          this.setState({visible: false});
        } else {
          this.props.navigation.push('Login');
          Toast.show({
            text: 'Anda belum Login. Silahkan Login',
            buttonText: 'OK',
            type: 'info',
            duration: 3000,
          });
          this.setState({visible: false});
        }
      });
    }, 2000);
  }

  render() {
    const {visible} = this.state;
    return (
      <SafeAreaView style={styles.body}>
        <View style={styles.vImage}>
          <Image source={require('../public/logo-app.png')} />
        </View>
        <View>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(86,130,163,0.2)"
            source={require('../../loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  body: {
    flex: 1,
  },
  vImage: {
    flex: 1,
    alignItems: 'center',
    marginTop: hp('10%'),
  },
});

export default withNavigation(Splash);
