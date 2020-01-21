import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import {List, ListItem, Left, Body} from 'native-base';

class DetailProfile extends Component {
  render() {
    const item = this.props.navigation.getParam('item', {});
    return (
      <>
        <SafeAreaView style={styles.body}>
          <ImageBackground
            style={styles.bg}
            source={{
              uri:
                'https://cdn.slidemodel.com/wp-content/uploads/13081-01-gradient-designs-powerpoint-backgrounds-16x9-1.jpg',
            }}>
            <View style={styles.view1}>
              <Image style={styles.img} source={{uri: item.image}} />
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={styles.ic}
                name="angle-left"
                size={30}
                color={'#fff'}
              />
            </TouchableOpacity>
          </ImageBackground>
          <View>
            <List>
              <ListItem>
                <Left style={styles.left}>
                  <Icon name="envelope" size={30} color={'#5682A3'} />
                  <Text style={styles.email}>{item.email}</Text>
                </Left>
              </ListItem>
            </List>
          </View>

          <View style={styles.vCam}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ChatRoom', {item})
              }>
              <Icon1 name="message-text" size={26} color={'#fff'} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {flex: 1},
  bg: {
    width: wp('100%'),
    height: hp('60%'),
  },
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    marginLeft: wp('8%'),
    marginBottom: hp('5%'),
  },
  img: {
    width: wp('14%'),
    height: hp('7%'),
    borderRadius: wp('50%'),
  },
  name: {
    color: '#fff',
    fontSize: wp('5%'),
    marginLeft: wp('4%'),
    fontWeight: 'bold',
  },
  view2: {
    backgroundColor: '#fff',
  },
  left: {
    alignItems: 'center',
  },
  email: {
    marginLeft: wp('4%'),
    fontSize: wp('4%'),
    color: '#7B7D7D',
    fontWeight: 'bold',
  },
  ic: {marginLeft: wp('5%'), marginTop: hp('2%')},
  vCam: {
    backgroundColor: '#5682A3',
    width: wp('14%'),
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('50%'),
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: wp('10%'),
    marginBottom: hp('5%'),
  },
});

export default withNavigation(DetailProfile);
