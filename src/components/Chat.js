import React, {Component} from 'react';
import {Text, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import firebase from '../../config/firebase';
import ListChat from './ListChat';
import arraySort from 'array-sort';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
      refreshing: false,
    };
  }

  handleRefresh = () => {
    this.setState({refreshing: false, message: []});
    this.getLastChat();
  };

  componentDidMount = () => {
    this.getLastChat();
  };

  getLastChat = () => {
    const userId = firebase.auth().currentUser.uid;
    let dbRefChat = firebase.database().ref('lastChat/' + userId);
    dbRefChat.on('child_added', snap => {
      let chat = snap.val();
      chat.uid = snap.key;
      firebase
        .database()
        .ref('users/' + snap.key)
        .on('value', val => {
          let person = val.val();
          const data = {
            uid: snap.key,
            name: person.name,
            image: person.image,
            createdAt: chat.createdAt,
            message: chat.message,
            email: person.email,
          };
          person.uid = val.key;
          this.setState(prev => {
            return {
              message: [...prev.message, data],
              refreshing: false,
            };
          });
        });
    });
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <FlatList
            data={arraySort(this.state.message, 'createdAt', {
              reverse: true,
            })}
            renderItem={({item}) => <ListChat item={item} />}
            keyExtractor={item => item.uid}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

export default withNavigation(Chat);
