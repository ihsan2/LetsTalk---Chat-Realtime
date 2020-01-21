import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import {List, ListItem, Thumbnail, Body, Button, Left} from 'native-base';
import {withNavigation} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {Divider} from 'react-native-elements';

const ListChat = props => {
  const {item} = props;
  const time = moment(item.createdAt).format('DD MMMM YYYY, hh:mma');
  return (
    <>
      <SafeAreaView styel={styles.body}>
        <View>
          <List>
            <ListItem thumbnail>
              <Left>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('DetailProfile', {item})
                  }>
                  <Thumbnail circular source={{uri: `${item.image}`}} />
                </TouchableOpacity>
              </Left>
              <Body style={styles.vBody}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('ChatRoom', {item})}>
                  <Text>{item.name}</Text>
                  <Text>{item.message}</Text>
                </TouchableOpacity>
              </Body>
              <Text style={styles.time1}>{time}</Text>
            </ListItem>
          </List>
          <Divider style={{height: hp('0.2%')}} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  div: {
    height: hp('0.15%'),
  },
  body: {flex: 1, flexDirection: 'column'},
  vBtn: {flexDirection: 'row', justifyContent: 'flex-end'},
  time1: {
    alignSelf: 'flex-end',
    marginRight: wp('1%'),
    fontSize: wp('3%'),
    color: '#7B7D7D',
    marginBottom: hp('0.5%'),
  },
});

export default withNavigation(ListChat);
