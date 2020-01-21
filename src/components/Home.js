import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
  Platform,
  BackHandler,
} from 'react-native';
import {Toast, Header, Left, Right, Tabs, Tab, TabHeading} from 'native-base';
import firebase from '../../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEn from 'react-native-vector-icons/Entypo';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import {withNavigation} from 'react-navigation';
import SearchBar from 'react-native-material-design-searchbar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import TabChat from '../screens/TabChat';
import TabMap from '../screens/TabMap';
import TabFriend from '../screens/TabFriend';
import _ from 'lodash';
import ListSearchUser from './ListSearchUser';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      initialPosition: {},
      marker: {},
      email: '',
      name: '',
      image: null,
      isClickSearch: false,
      currentTab: false,
      search: '',
      users: [],
      userId: firebase.auth().currentUser.uid,
      isLoad: false,
      count: 0,
    };
    this.onSearch = _.debounce(this.onSearch, 750);
  }

  // onRefresh = () => {
  //   this.coba();
  //   console.warn(this.state.initialPosition);
  // };

  componentDidMount() {
    this.get();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  get = () => {
    const userId = firebase.auth().currentUser.uid;

    firebase
      .database()
      .ref('users/' + userId)
      .once('value')
      .then(snapshot => {
        const {name, email, image} = snapshot.val();
        this.setState({name, email, image});
      });

    this.requestLocationPermission();
  };

  onSearch = value => {
    firebase
      .database()
      .ref('users')
      .orderByChild('name')
      .startAt(value)
      .endAt(value)
      .on('child_added', val => {
        let person = val.val();
        person.uid = val.key;
        this.setState(() => {
          return {
            users: [person],
          };
        });
      });
  };

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.warn('iPhone: ' + response);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      // console.warn('Android: ' + response);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    }
  };

  locateCurrentPosition = () => {
    const userId = firebase.auth().currentUser.uid;
    Geolocation.getCurrentPosition(
      position => {
        // console.warn(position);

        let initialPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0,
        };
        let marker = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({initialPosition, marker});

        firebase
          .database()
          .ref('users/' + userId)
          .on('value', snapshot => {
            const {latitude, longitude} = position.coords;
            const {name, email, image} = snapshot.val();
            const data = {name, email, image, latitude, longitude};
            firebase
              .database()
              .ref('users/' + userId)
              .set(data);
          });
      },
      error => {
        console.log(error);
      },

      {enableHighAccuracy: true, timeout: 10000},

      // this.requestLocationPermission(),
    );
  };

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

  signOut = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda Yakin Untuk Keluar?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.props.navigation.navigate('Splash');
                Toast.show({
                  text: 'Success: Anda Berhasil Logout',
                  buttonText: 'OK',
                  type: 'info',
                });
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  addFriends = (item, index) => {
    this.setState({isLoad: !this.state.isLoad});
    const items = [...this.state.users];
    const userId = firebase.auth().currentUser.uid;

    const dataReq = {
      email: items[index].email,
    };

    const refFriendRequest = firebase
      .database()
      .ref('friendRequests/' + `${userId}/${items[index].uid}`);
    const refFriendConfirm = firebase
      .database()
      .ref('friendConfirms/' + `${items[index].uid}/${userId}`);
    // add to friendRequest
    refFriendRequest.set(dataReq).then(() => {
      Toast.show({
        text:
          'Success: Anda Berhasil Menambahkan... Tunggu Konfirmasi Pertemanan',
        buttonText: 'OK',
        type: 'info',
        duration: 2500,
      });
      this.setState({isLoad: !this.state.isLoad});
    });
    // add to friendConfirms
    firebase
      .database()
      .ref('users/' + userId)
      .once('value')
      .then(snapshot => {
        const {email} = snapshot.val();
        const dataConf = {
          email,
        };
        refFriendConfirm.set(dataConf);
      });
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          {!this.state.isClickSearch ? (
            <>
              <Header style={styles.header}>
                <Left>
                  <Text style={styles.txHead}>ChatApp</Text>
                </Left>
                <Right>
                  <Icon
                    name="search"
                    size={26}
                    color={'#fff'}
                    style={styles.icHead}
                    onPress={() => this.setState({isClickSearch: true})}
                  />
                  <Menu>
                    <MenuTrigger>
                      <IconEn
                        name="dots-three-vertical"
                        size={26}
                        color={'#fff'}
                        style={styles.icDots}
                      />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption
                        style={styles.menuProfile}
                        onSelect={() =>
                          this.props.navigation.navigate('Profile')
                        }>
                        <Text style={styles.txProfile}>Profile</Text>
                      </MenuOption>
                      <MenuOption
                        style={styles.menuProfile}
                        onSelect={this.signOut.bind(this)}>
                        <Text style={styles.txLogout}>Logout</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </Right>
              </Header>
              <Tabs
                tabBarUnderlineStyle={styles.underline}
                scrollWithoutAnimation={false}>
                <Tab
                  heading={
                    <TabHeading style={styles.tabs}>
                      <IconM
                        style={styles.iconTabs}
                        name="message-text"
                        size={30}
                        color={'#fff'}
                      />
                      <Text style={styles.activeTx}>Chat</Text>
                    </TabHeading>
                  }>
                  <TabChat />
                </Tab>
                <Tab
                  heading={
                    <TabHeading style={styles.tabs}>
                      <Icon
                        style={styles.iconTabs}
                        name="users"
                        size={30}
                        color={'#fff'}
                      />
                      <Text style={styles.activeTx}>Friend</Text>
                    </TabHeading>
                  }>
                  <TabFriend />
                </Tab>
                <Tab
                  heading={
                    <TabHeading style={styles.tabs}>
                      <IconM
                        style={styles.iconTabs}
                        name="google-maps"
                        size={30}
                        color={'#fff'}
                      />
                      <Text style={styles.activeTx}>Map</Text>
                    </TabHeading>
                  }>
                  <TabMap
                    initialPosition={this.state.initialPosition}
                    marker={this.state.marker}
                  />
                </Tab>
              </Tabs>
            </>
          ) : (
            <SafeAreaView>
              <SearchBar
                onSearchChange={this.onSearch}
                height={54}
                value="s"
                alwaysShowBackButton={true}
                onBackPress={() => this.setState({isClickSearch: false})}
                placeholder={'Search...'}
                autoCorrect={false}
                returnKeyType={'search'}
              />

              <FlatList
                data={this.state.users}
                renderItem={({item, index}) => (
                  <ListSearchUser
                    item={item}
                    addFriends={() => this.addFriends(item, index)}
                    load={this.state.isLoad}
                  />
                )}
                keyExtractor={item => item.uid}
              />
            </SafeAreaView>
          )}
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  header: {
    backgroundColor: '#5682A3',
  },
  tabs: {
    backgroundColor: '#5682A3',
  },
  iconTabs: {
    marginRight: wp('3%'),
  },
  activeTx: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  inActiveTx: {color: '#A6ACAF', fontSize: wp('5%'), fontWeight: 'bold'},
  txHead: {
    color: '#fff',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  menuProfile: {
    height: hp('6%'),
    justifyContent: 'center',
  },
  txProfile: {
    color: '#8d8daa',
    fontSize: hp('2.5%'),
    marginLeft: wp('3%'),
    fontWeight: 'bold',
  },
  txLogout: {
    color: 'red',
    fontSize: hp('2.5%'),
    marginLeft: wp('3%'),
    fontWeight: 'bold',
  },
  icHead: {marginRight: wp('4%')},
  icDots: {marginRight: wp('2%')},
  underline: {
    backgroundColor: '#E7EBF0',
  },
});

export default withNavigation(Home);
