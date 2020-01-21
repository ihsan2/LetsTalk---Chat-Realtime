import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Item, Input} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

const ListChatRoom = props => {
  const {item} = props;
  const time = moment(item.createdAt).format('DD MMMM YYYY, hh:mma');

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
          {item.stts === 'sender' ? (
            <View style={styles.vSender}>
              <Item style={styles.itemSender} stackedLabel>
                <Input
                  value={item.message}
                  multiline={true}
                  editable={false}
                  style={{marginLeft: wp('1%'), width: wp('78%')}}
                  placeholder="Type message ..."
                />
                <Text style={styles.time}>{time}</Text>
              </Item>
            </View>
          ) : (
            <View style={styles.vReceiver}>
              <Item style={styles.itemReceiver} stackedLabel>
                <Input
                  value={item.message}
                  multiline={true}
                  editable={false}
                  style={{marginLeft: wp('1%'), width: wp('78%')}}
                  placeholder="Type message ..."
                />
                <Text style={styles.time1}>{time}</Text>
              </Item>
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  body: {flex: 1},
  itemReceiver: {
    backgroundColor: '#fff',
    width: wp('80%'),
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
    borderBottomRightRadius: wp('3%'),
    marginTop: hp('0.25%'),
    marginBottom: hp('0.25%'),
  },
  itemSender: {
    backgroundColor: 'rgba(217,255,185,0.7)',
    width: wp('80%'),
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
    borderBottomLeftRadius: wp('3%'),
    marginTop: hp('0.25%'),
    marginBottom: hp('0.25%'),
  },
  vSender: {
    alignItems: 'flex-end',
    marginRight: hp('0.5%'),
  },
  vReceiver: {alignItems: 'flex-start', marginLeft: hp('0.5%')},
  time: {
    alignSelf: 'flex-end',
    marginRight: wp('1%'),
    fontSize: wp('3%'),
    color: '#7B7D7D',
    marginBottom: hp('0.5%'),
  },
  time1: {
    alignSelf: 'flex-end',
    marginRight: wp('1%'),
    fontSize: wp('3%'),
    color: '#7B7D7D',
    marginBottom: hp('0.5%'),
  },
});

export default withNavigation(ListChatRoom);
