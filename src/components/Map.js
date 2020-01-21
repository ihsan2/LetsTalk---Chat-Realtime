import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {List, ListItem, Left, Thumbnail, Body, Button} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firebase from '../../config/firebase';
import Carousel from 'react-native-snap-carousel';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Map extends Component {
  constructor() {
    super();
    this.state = {
      markers: [],
      friends: [],
      markPress: false,
      marker: {},
    };
  }

  componentDidMount() {
    this.getFriends();
  }

  getFriends = () => {
    this.setState({friends: []});
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('friends/' + userId)
      .on('child_added', val => {
        firebase
          .database()
          .ref('users/' + val.key)
          .on('value', snap => {
            let person = snap.val();
            person.uid = snap.key;
            this.setState(prev => {
              return {
                friends: [...prev.friends, person],
              };
            });
          });
      });
  };

  refresh = () => {
    this.getFriends();
    this._map.animateToRegion(this.props.initialPosition);
  };

  onMarkerPressed = (location, index) => {
    this.setState({markPress: true});
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0,
    });

    this._carousel.snapToItem(index);
  };

  renderCarouselItem = ({item}) => (
    <View style={styles.cardContainer}>
      <List>
        <ListItem avatar>
          <Left>
            <Thumbnail source={{uri: `${item.image}`}} />
          </Left>
          <Body>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardEmail} note>
              {item.email}
            </Text>
          </Body>
        </ListItem>
      </List>
      <View style={styles.cardButton}>
        <Button
          style={styles.cardChat}
          onPress={() => this.props.navigation.navigate('ChatRoom', {item})}>
          <Text style={styles.cardTxC}>Chat</Text>
        </Button>
        <Button
          style={styles.cardProfile}
          onPress={() =>
            this.props.navigation.navigate('DetailProfile', {item})
          }>
          <Text style={styles.cardTxP}>Profile</Text>
        </Button>
      </View>
    </View>
  );

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <MapView
            followsUserLocation={true}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            ref={map => (this._map = map)}
            style={styles.map1}
            showsMyLocationButton={true}
            initialRegion={this.props.initialPosition}>
            <Marker coordinate={this.props.marker}>
              <Image
                style={styles.your}
                source={require('../public/your.png')}
              />
              <Callout>
                <View style={styles.vyourCall}>
                  <Text style={styles.txyourCall}>Your Location</Text>
                </View>
              </Callout>
            </Marker>

            {this.state.friends.map((marker, index) => (
              <Marker
                ref={ref => (this.state.markers[index] = ref)}
                onPress={() => this.onMarkerPressed(marker, index)}
                key={marker.email}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}>
                <ImageBackground
                  source={require('../public/back-marker.png')}
                  style={styles.bgImg}>
                  <Image
                    style={styles.imgFriends}
                    source={{
                      uri: marker.image,
                    }}
                  />
                </ImageBackground>
                <Callout>
                  <View style={styles.vyourCall}>
                    <Text style={styles.txyourCall}>{marker.name}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.friends}
            containerCustomStyle={styles.carousel}
            renderItem={this.renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
            removeClippedSubviews={false}
          />
          <View style={styles.vMyLoc}>
            <TouchableOpacity onPress={this.refresh.bind(this)}>
              <Icon name="my-location" size={26} color={'#5682A3'} />
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
  map: {
    width: wp('100%'),
    height: hp('73'),
  },
  map1: {
    flex: 1,
  },
  bgImg: {
    width: wp('12.5%'),
    height: hp('9%'),
  },
  your: {
    width: 70,
    height: 70,
  },
  imgFriends: {
    width: wp('9%'),
    height: hp('4.5%'),
    borderRadius: wp('50%'),
    marginLeft: wp('2%'),
    marginTop: hp('0.8%'),
  },
  vyourCall: {
    width: wp('30%'),
    height: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txyourCall: {
    fontSize: wp('5%'),
    color: 'black',
  },
  callFriend: {
    backgroundColor: 'white',
    width: wp('90%'),
    height: hp('10%'),
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: hp('3'),
  },
  cardContainer: {
    backgroundColor: 'rgba(123, 125, 125, 0.75)',
    height: hp('20%'),
    borderRadius: wp('2%'),
  },
  cardName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('6%'),
  },
  cardEmail: {
    color: '#fff',
    fontWeight: '900',
    fontSize: wp('4%'),
    marginTop: hp('0.5%'),
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center',
  },
  cardButton: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    justifyContent: 'center',
  },
  cardChat: {
    width: wp('32%'),
    marginRight: wp('2%'),
    justifyContent: 'center',
    backgroundColor: '#5682A3',
  },
  cardProfile: {
    width: wp('32%'),
    marginLeft: wp('2%'),
    justifyContent: 'center',
    backgroundColor: '#D0D3D4',
  },
  cardTx: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  cardTxC: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  cardTxP: {
    color: '#5682A3',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  vMyLoc: {
    backgroundColor: '#fff',
    width: wp('14%'),
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('50%'),
    position: 'absolute',
    right: 0,
    top: 0,
    marginRight: wp('1%'),
    marginTop: hp('0.5%'),
  },
});

export default withNavigation(Map);
