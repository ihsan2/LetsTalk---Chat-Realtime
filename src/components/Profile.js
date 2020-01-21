import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Toast,
  Header,
  Left,
  Body,
  Item,
  Label,
  Input,
  Button,
} from 'native-base';
import firebase from '../../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableOpacity as TO, ScrollView} from 'react-native-gesture-handler';
import {Divider} from 'react-native-elements';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
      nameTmp: '',
      isModalVisible: false,
      isLoad: false,
      uri: '',
      image: null,
      imageTmp: null,
      filename: '',
      filesize: 0,
      isSelectImage: false,
    };
  }

  selectImage = () => {
    const options = {};
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri, isStatic: true};
        this.setState({
          image: source,
          uri: response.uri,
          filename: response.fileName,
          filesize: response.fileSize,
          isSelectImage: !this.state.isSelectImage,
        });
      }
    });
  };

  upload = async () => {
    this.setState({isLoad: true});
    const response = await fetch(this.state.uri);
    const userId = firebase.auth().currentUser.uid;
    const blob = await response.blob();
    const name = `${userId}-${this.state.name.split(' ').join('-')}`;

    var ref = firebase
      .storage()
      .ref()
      .child('images/profile/')
      .child(name);

    return ref.put(blob).then(() => {
      ref.getDownloadURL().then(url => {
        firebase
          .database()
          .ref('users')
          .child(userId)
          .set({
            email: this.state.email,
            name: this.state.name,
            image: url,
          });
        this.props.navigation.push('Profile');
        Toast.show({
          text: 'Success: Anda Berhasil Mengubah Foto Profil',
          buttonText: 'OK',
          type: 'success',
        });
        this.setState({isLoad: false});
      });
    });
  };

  componentDidMount() {
    const {email} = firebase.auth().currentUser;
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + userId)
      .on('value', snapshot => {
        const name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
        const image = (snapshot.val() && snapshot.val().image) || null;
        this.setState({name, email, nameTmp: name, image, imageTmp: image});
      });
  }

  saveName = () => {
    this.setState({isLoad: true});
    const {name} = this.state;
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users')
      .child(userId)
      .update({
        name,
      })
      .then(() => {
        this.setState({isModalVisible: !this.state.isModalVisible});
        Toast.show({
          text: 'Success: Anda Berhasil Mengubah Nama Profil',
          buttonText: 'OK',
          type: 'success',
        });
        this.setState({isLoad: false});
      });
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.push('Login');
        Toast.show({
          text: 'Success: Anda Berhasil Logout',
          buttonText: 'OK',
          type: 'info',
        });
      });
  };

  render() {
    return (
      <>
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
            <Body>
              <Text style={styles.txHead}>Profile</Text>
            </Body>
          </Header>
          <ScrollView>
            <View style={styles.vImage}>
              <Image
                style={styles.image}
                source={
                  this.state.isSelectImage
                    ? this.state.image
                    : {
                        uri: this.state.image
                          ? this.state.image
                          : 'http://raivens.com/wp-content/uploads/2016/08/Dummy-image.jpg',
                      }
                }
              />
              <View style={styles.vCam}>
                <TouchableOpacity onPress={this.selectImage.bind(this)}>
                  <Icon name="camera" size={26} color={'#fff'} />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.isSelectImage && (
              <View style={styles.upload}>
                {this.state.isLoad ? (
                  <ActivityIndicator />
                ) : (
                  <>
                    <Button
                      success
                      onPress={this.upload.bind(this)}
                      style={styles.btnSave}>
                      <Text style={styles.txUplaod}>Simpan</Text>
                    </Button>
                    <Button
                      danger
                      onPress={() =>
                        this.setState({
                          isSelectImage: !this.state.isSelectImage,
                          image: this.state.imageTmp,
                        })
                      }
                      style={styles.btnCancel}>
                      <Text style={styles.txUplaod}>Batal</Text>
                    </Button>
                  </>
                )}
              </View>
            )}

            <View style={styles.vName}>
              <Icon name="user" size={24} color={'#5682A3'} />
              <TO
                onPress={() =>
                  this.setState({isModalVisible: !this.state.isModalVisible})
                }>
                <Item stackedLabel style={styles.itemName}>
                  <Label>Nama</Label>
                  <Label style={styles.label1}>{this.state.name}</Label>
                </Item>
              </TO>
              <TouchableOpacity
                onPress={() =>
                  this.setState({isModalVisible: !this.state.isModalVisible})
                }>
                <Icon name="pencil" size={24} color={'#8d8daa'} />
              </TouchableOpacity>
            </View>
            <Divider style={styles.div} />
          </ScrollView>
        </SafeAreaView>

        <Modal
          isVisible={this.state.isModalVisible}
          deviceHeight={hp('100%')}
          deviceWidth={wp('100%')}>
          <View style={styles.vModal}>
            <View style={styles.vModalName}>
              <Item stackedLabel style={styles.itemModal}>
                <Label>Masukkan Nama Anda</Label>
                <Input
                  value={this.state.name}
                  onChangeText={name => this.setState({name})}
                />
              </Item>
            </View>
            <View style={styles.vModalBtn}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isModalVisible: !this.state.isModalVisible,
                    name: this.state.nameTmp,
                  })
                }>
                <Text style={styles.textBack}>Back</Text>
              </TouchableOpacity>
              {this.state.isLoad ? (
                <ActivityIndicator />
              ) : (
                <TouchableOpacity onPress={this.saveName.bind(this)}>
                  <Text style={styles.textSave}>Simpan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
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
  txHead: {
    color: '#fff',
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginLeft: wp('-12%'),
  },
  icBack: {
    marginLeft: wp('2%'),
  },
  image: {
    width: wp('46%'),
    height: hp('23%'),
    borderRadius: wp('50%'),
    borderColor: '#5682A3',
    borderWidth: wp('0.2%'),
  },
  vImage: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  vCam: {
    backgroundColor: '#5682A3',
    width: wp('14%'),
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('50%'),
    marginLeft: wp('32%'),
    marginTop: hp('-7%'),
  },
  vName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('4%'),
    marginLeft: wp('5%'),
  },
  itemName: {
    marginLeft: wp('5%'),
    width: wp('75%'),
  },
  div: {
    height: hp('0.2'),
    top: hp('-0.1%'),
    marginLeft: wp('14%'),
  },
  label1: {
    fontSize: wp('5%'),
    fontWeight: '900',
  },
  vModal: {
    backgroundColor: '#fff',
    height: hp('20%'),
  },
  vModalName: {
    marginTop: hp('1.5%'),
  },
  itemModal: {
    marginLeft: wp('3%'),
    marginRight: wp('3%'),
  },
  vModalBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp('3.5%'),
    marginRight: hp('2%'),
  },
  textBack: {
    color: '#5682A3',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginRight: wp('2%'),
  },
  textSave: {
    color: '#5682A3',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  upload: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  btnSave: {
    width: wp('20%'),
    justifyContent: 'center',
    height: hp('5%'),
    borderRadius: wp('5%'),
    marginRight: wp('2.5%'),
  },
  btnCancel: {
    width: wp('20%'),
    justifyContent: 'center',
    height: hp('5%'),
    borderRadius: wp('5%'),
    marginLeft: wp('2.5%'),
  },
  txUplaod: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default withNavigation(Home);
