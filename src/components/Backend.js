import firebase from '../../config/firebase';
import Firebase from 'firebase';

class Backend {
  uid = '';
  messagesRef = null;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUid(user.uid);
      } else {
      }
    });
    this.state = {
      _id: '',
      name: '',
      image: '',
    };
  }

  setUid(value) {
    this.uid = value;
  }

  getUid() {
    return this.uid;
  }

  loadMessages(callback) {
    this.messagesRef = firebase.database().ref();
    this.messagesRef.off();
    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          id: message.user._id,
          name: message.user.name,
          avatar: message.user.avatar,
        },
      });
    };
    this.messagesRef.limitToLast(20).on('child_added', onReceive);
  }

  get timestamp() {
    return Firebase.database.ServerValue.TIMESTAMP;
  }

  sendMessage(messages) {
    let dbRefUser = firebase.database().ref('users/' + this.getUid());
    dbRefUser.once('value').then(snapshot => {
      const name = snapshot.val().name;
      const image = snapshot.val().image;
      messages.forEach(message => {
        this.messagesRef.push({
          text: message.text,
          user: {
            _id: this.getUid(),
            name,
            avatar: image,
          },
          createdAt: this.timestamp,
        });
      });
    });
  }

  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }
}

export default new Backend();
