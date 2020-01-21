//
import React from 'react';
import {
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  View,
} from 'react-native';
import {Header, Body, Left, Input, Item} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../config/firebase';
import {withNavigation} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ListChatRoom from './ListChatRoom';
import arraySort from 'array-sort';
class ChatRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      name: '',
      image: null,
      personId: '',
      userId: '',
      message: '',
      totalRow: 0,
      friends: [],
      isFriend: 0,
    };
  }

  componentDidMount = () => {
    const item = this.props.navigation.getParam('item', {});

    const userId = firebase.auth().currentUser.uid;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      personId: item.uid,
      userId,
      name: item.name,
      image: item.image,
    });

    let dbRef = firebase.database().ref('message/' + `${userId}/${item.uid}`);
    dbRef.orderByChild('createdAt').on('child_added', val => {
      let message = val.val();
      this.setState(prevState => {
        return {
          messages: [...prevState.messages, message],
          totalRow: val.numChildren(),
        };
      });
    });

    firebase
      .database()
      .ref('friends/' + userId)
      .on('value', val => {
        if (!val.val()) {
          this.setState({isFriend: -1});
        } else {
          let person = val.val();
          person.uid = val.key;
          const peopleArray = Object.keys(person).map(i => person[i]);
          const cek = peopleArray.map(x => x.email).indexOf(item.email);
          this.setState({isFriend: cek});
        }
      });
  };

  sendMessage = () => {
    const createdAt = Date.now();

    const messageSender = `${this.state.personId}/${createdAt}`;
    const messageReceiver = `${this.state.userId}/${createdAt}`;
    const senderRef = firebase
      .database()
      .ref(`message/${this.state.userId}/` + messageSender);
    const receiverRef = firebase
      .database()
      .ref(`message/${this.state.personId}/` + messageReceiver);
    const senderLastChatRef = firebase
      .database()
      .ref(`lastChat/${this.state.userId}/` + this.state.personId);
    const receiverLastChatRef = firebase
      .database()
      .ref(`lastChat/${this.state.personId}/` + this.state.userId);

    senderRef.set({message: this.state.message, createdAt, stts: 'sender'});
    receiverRef.set({message: this.state.message, createdAt, stts: 'receiver'});
    senderLastChatRef.set({message: this.state.message, createdAt});
    receiverLastChatRef.set({message: this.state.message, createdAt});
    this.setState({message: ''});
  };

  render() {
    return (
      <>
        <ImageBackground
          source={{
            uri:
              'https://i.pinimg.com/originals/51/ed/c0/51edc046eb80046ee4755ee71d0f19ca.jpg',
          }}
          style={{
            flex: 1,
          }}>
          <SafeAreaView style={styles.body}>
            <Header style={styles.header}>
              <Left>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Home')}>
                  <Icon
                    name="arrow-left"
                    color={'#fff'}
                    size={20}
                    style={styles.icBack}
                  />
                </TouchableOpacity>
              </Left>
              <Body style={styles.bodyHead}>
                <Image style={styles.image} source={{uri: this.state.image}} />
                <Text style={styles.txHead}>{this.state.name}</Text>
              </Body>
            </Header>
            <></>
            {this.state.isFriend === -1 ? (
              <View style={styles.viewTeman}>
                <Text style={styles.textTeman}>
                  Anda Belum Berteman Dengan {this.state.name}
                </Text>
                <Text style={styles.textTeman}>
                  Untuk Bisa Chat, Anda harus Berteman Terlebih Dahulu
                </Text>
                <Item style={styles.itemType}>
                  <Input
                    value={this.state.message}
                    onChangeText={message => this.setState({message})}
                    multiline={true}
                    editable={false}
                    style={{marginLeft: wp('1%')}}
                    placeholder="Anda Belum Temenan ..."
                  />
                </Item>
              </View>
            ) : (
              <Item style={styles.itemType}>
                <Input
                  value={this.state.message}
                  onChangeText={message => this.setState({message})}
                  multiline={true}
                  style={{marginLeft: wp('1%')}}
                  placeholder="Type message ..."
                />
                {this.state.message ? (
                  <TouchableOpacity onPress={this.sendMessage.bind(this)}>
                    <Text style={styles.send}>Send</Text>
                  </TouchableOpacity>
                ) : (
                  <Text />
                )}
              </Item>
            )}
            {this.state.isFriend !== -1 && (
              <FlatList
                style={styles.list}
                data={arraySort(this.state.messages, 'createdAt', {
                  reverse: true,
                })}
                renderItem={({item}) => <ListChatRoom item={item} />}
                keyExtractor={item => item.createdAt}
                inverted={true}
              />
            )}
          </SafeAreaView>
        </ImageBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  itemType: {
    marginRight: wp('1%'),
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    // borderRadius: wp('10%'),
  },
  list: {
    marginBottom: hp('6.5%'),
  },
  send: {
    color: '#5682A3',
    fontWeight: '900',
    fontSize: wp('5%'),
    marginRight: wp('4%'),
  },
  image: {
    width: wp('10%'),
    height: hp('5%'),
    borderRadius: hp('50%'),
    marginRight: wp('15%'),
  },
  bodyHead: {
    flexDirection: 'row',
    marginLeft: wp('-18%'),
  },
  body: {
    flex: 1,
  },
  header: {
    backgroundColor: '#5682A3',
  },
  txHead: {
    color: '#fff',
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginLeft: wp('-12%'),
  },
  icBack: {
    marginLeft: wp('2%'),
  },
  viewTeman: {
    height: hp('93%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTeman: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  load: {
    flex: 1,
  },
});

export default withNavigation(ChatRoom);
