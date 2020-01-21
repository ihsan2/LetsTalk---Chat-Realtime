import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../config/firebase';
import ListRequest from './ListRequest';
import ListResponse from './ListResponse';
import ListFriend from './ListFriend';
import {Toast} from 'native-base';
import {withNavigation} from 'react-navigation';

class Friend extends React.Component {
  constructor() {
    super();
    this.state = {
      reqCol: false,
      userId: firebase.auth().currentUser.uid,
      requests: [],
      confirms: [],
      friends: [],
      isLoad1: false,
      isLoad2: false,
      isLoad3: false,
      text: '',
      refreshing: false,
    };
  }

  cancel = (item, index) => {
    this.setState({isLoad1: !this.state.isLoad1});
    const items = [...this.state.requests];

    const refFriendRequest = firebase
      .database()
      .ref('friendRequests/' + `${this.state.userId}/${items[index].uid}`);
    const refFriendConfirm = firebase
      .database()
      .ref('friendConfirms/' + `${items[index].uid}/${this.state.userId}`);
    // remove to friendRequest
    refFriendRequest.remove().then(() => {
      Toast.show({
        text: 'Anda membatalkan permintaan pertemanan',
        buttonText: 'OK',
        type: 'info',
        duration: 2500,
      });
      this.setState({isLoad1: !this.state.isLoad1});
      refFriendConfirm.remove();
      this.setState(prev => {
        return {
          requests: [],
        };
      });
      this.getDataRequests();
    });
  };

  reject = (item, index) => {
    this.setState({isLoad2: !this.state.isLoad2});
    const items = [...this.state.confirms];

    const refFriendRequest = firebase
      .database()
      .ref('friendRequests/' + `${items[index].uid}/${this.state.userId}`);
    const refFriendConfirm = firebase
      .database()
      .ref('friendConfirms/' + `${this.state.userId}/${items[index].uid}`);
    // remove to friendRequest
    refFriendConfirm.remove().then(() => {
      Toast.show({
        text: `Anda menolak permintaan pertemanan ${items[index].name}`,
        buttonText: 'OK',
        type: 'info',
        duration: 2500,
      });
      this.setState({isLoad2: !this.state.isLoad2});
      refFriendRequest.remove();
      this.setState(prev => {
        return {
          confirms: [],
        };
      });
      this.getDataConfirms();
    });
  };

  receive = (item, index) => {
    this.setState({isLoad2: !this.state.isLoad2});
    const items = [...this.state.confirms];

    const refFriendUser = firebase
      .database()
      .ref('friends/' + `${this.state.userId}/${items[index].uid}`);
    const refFriendPerson = firebase
      .database()
      .ref('friends/' + `${items[index].uid}/${this.state.userId}`);
    const refFriendRequest = firebase
      .database()
      .ref('friendRequests/' + `${items[index].uid}/${this.state.userId}`);
    const refFriendConfirm = firebase
      .database()
      .ref('friendConfirms/' + `${this.state.userId}/${items[index].uid}`);
    // remove to friendRequest
    refFriendConfirm.remove().then(() => {
      Toast.show({
        text: `Anda sekarang berteman dengan ${items[index].name}`,
        buttonText: 'OK',
        type: 'info',
        duration: 2500,
      });
      this.setState({isLoad2: !this.state.isLoad2});
      refFriendRequest.remove();
      this.setState(prev => {
        return {
          confirms: [],
        };
      });
      this.getDataConfirms();
      refFriendUser.set({
        email: items[index].email,
      });
      firebase
        .database()
        .ref('users/' + this.state.userId)
        .once('value')
        .then(snapshot => {
          const {email} = snapshot.val();
          refFriendPerson.set({
            email,
          });
        });
    });
  };

  deleteFriend = (item, index) => {
    this.setState({isLoad3: !this.state.isLoad3});
    const items = [...this.state.friends];

    const refFriendUser = firebase
      .database()
      .ref('friends/' + `${this.state.userId}/${items[index].uid}`);
    const refMessagePerson = firebase
      .database()
      .ref('message/' + `${items[index].uid}/${this.state.userId}`);
    const refMessageUser = firebase
      .database()
      .ref('message/' + `${this.state.userId}/${items[index].uid}`);
    const refFriendPerson = firebase
      .database()
      .ref('friends/' + `${items[index].uid}/${this.state.userId}`);

    const refLastChatPerson = firebase
      .database()
      .ref('lastChat/' + `${items[index].uid}/${this.state.userId}`);
    const refLastChatUser = firebase
      .database()
      .ref('lastChat/' + `${this.state.userId}/${items[index].uid}`);
    Alert.alert(
      'Hapus Pertemanan',
      'Apakah Anda Yakin Untuk Menghapus Pertemanan... Apabila anda menghapus pertemanan, Semua pesan akan hilang',
      [
        {
          text: 'Cancel',
          onPress: () => {
            this.setState({isLoad3: !this.state.isLoad3});
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            refFriendUser.remove().then(() => {
              Toast.show({
                text: `Anda menghapus pertemanan dengan ${items[index].name}`,
                buttonText: 'OK',
                type: 'info',
                duration: 2500,
              });
              this.setState({isLoad3: !this.state.isLoad3});
              refFriendPerson.remove();
              this.setState(prev => {
                return {
                  friends: [],
                };
              });
              this.getDataFriends();
              refMessagePerson.remove();
              refMessageUser.remove();
              refLastChatPerson.remove();
              refLastChatUser.remove();
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  getDataRequests = () => {
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('friendRequests/' + userId)
      .on('child_added', val => {
        firebase
          .database()
          .ref('users/' + val.key)
          .on('value', snap => {
            let person = snap.val();
            person.uid = snap.key;
            this.setState(prev => {
              return {
                requests: [...prev.requests, person],
              };
            });
          });
      });
  };

  getDataConfirms = () => {
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('friendConfirms/' + userId)
      .on('child_added', val => {
        firebase
          .database()
          .ref('users/' + val.key)
          .on('value', snap => {
            let person = snap.val();
            person.uid = snap.key;
            this.setState(prev => {
              return {
                confirms: [...prev.confirms, person],
              };
            });
          });
      });
  };

  getDataFriends = () => {
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

  componentDidMount() {
    this.getDataRequests();
    this.getDataConfirms();
    this.getDataFriends();
  }

  onRefresh = () => {
    this.setState({friends: [], requests: [], confirms: [], refreshing: false});
    this.getDataRequests();
    this.getDataConfirms();
    this.getDataFriends();
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <Collapse>
              <CollapseHeader
                style={styles.headerRequest}
                onToggle={() => this.setState({reqCol: !this.state.reqCol})}>
                <View style={styles.viewRequest}>
                  <Text style={styles.textRequest}>Request Pertemanan</Text>
                  {!this.state.isLoad1 ? (
                    <Icon
                      style={styles.icon}
                      name="angle-right"
                      size={20}
                      color={'#5682A3'}
                    />
                  ) : (
                    <ActivityIndicator small />
                  )}
                </View>
              </CollapseHeader>
              <CollapseBody>
                <FlatList
                  data={this.state.requests}
                  renderItem={({item, index}) => (
                    <ListRequest
                      item={item}
                      cancel={() => this.cancel(item, index)}
                    />
                  )}
                  keyExtractor={item => item.uid}
                />
              </CollapseBody>
            </Collapse>
            <Collapse>
              <CollapseHeader
                style={styles.headerRequest}
                onToggle={() => this.setState({reqCol: !this.state.reqCol})}>
                <View style={styles.viewRequest}>
                  <Text style={styles.textRequest}>Permintaan Pertemanan</Text>
                  {!this.state.isLoad2 ? (
                    <Icon
                      style={styles.icon}
                      name="angle-right"
                      size={20}
                      color={'#5682A3'}
                    />
                  ) : (
                    <ActivityIndicator small />
                  )}
                </View>
              </CollapseHeader>
              <CollapseBody>
                <FlatList
                  data={this.state.confirms}
                  renderItem={({item, index}) => (
                    <ListResponse
                      item={item}
                      reject={() => this.reject(item, index)}
                      receive={() => this.receive(item, index)}
                    />
                  )}
                  keyExtractor={item => item.uid}
                />
              </CollapseBody>
            </Collapse>
            <Collapse>
              <CollapseHeader
                style={styles.headerRequest}
                onToggle={() => this.setState({reqCol: !this.state.reqCol})}>
                <View style={styles.viewRequest}>
                  <Text style={styles.textRequest}>Teman Anda</Text>
                  {!this.state.isLoad3 ? (
                    <Icon
                      style={styles.icon}
                      name="angle-right"
                      size={20}
                      color={'#5682A3'}
                    />
                  ) : (
                    <ActivityIndicator small />
                  )}
                </View>
              </CollapseHeader>
              <CollapseBody>
                <FlatList
                  data={this.state.friends}
                  renderItem={({item, index}) => (
                    <ListFriend
                      item={item}
                      deleteFriend={() => this.deleteFriend(item, index)}
                    />
                  )}
                  keyExtractor={item => item.uid}
                />
              </CollapseBody>
            </Collapse>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    marginTop: hp('0.5%'),
    flex: 1,
  },
  headerRequest: {
    backgroundColor: '#D0D3D4',
    height: hp('5%'),
    justifyContent: 'center',
  },
  viewRequest: {
    marginLeft: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textRequest: {
    color: '#5682A3',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  icon: {
    marginRight: wp('2%'),
  },
  scrollView: {
    flex: 1,
  },
});

export default withNavigation(Friend);
