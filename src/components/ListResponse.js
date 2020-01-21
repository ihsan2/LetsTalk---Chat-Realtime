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
import {Divider} from 'react-native-elements';

const ListResponse = props => {
  const {item, reject, receive} = props;
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
                  <Text>{item.email}</Text>
                </TouchableOpacity>
              </Body>
            </ListItem>
            <View style={styles.vBtn}>
              <Button transparent onPress={receive}>
                <Text style={styles.terima}>Terima</Text>
              </Button>
              <Button transparent onPress={reject}>
                <Text style={styles.tolak}>Tolak</Text>
              </Button>
            </View>
          </List>
        </View>
        <Divider style={styles.div} />
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
  tolak: {
    color: '#dc3545',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginRight: wp('4%'),
  },
  terima: {
    color: '#28a745',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginRight: wp('4%'),
  },
});

export default withNavigation(ListResponse);
