import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  List,
  ListItem,
  Thumbnail,
  Body,
  Right,
  Button,
  Left,
} from 'native-base';
import {withNavigation} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ListFriend = props => {
  const {item, deleteFriend} = props;
  return (
    <>
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
          <Right>
            <Button transparent onPress={deleteFriend}>
              <Text style={styles.right}>Hapus</Text>
            </Button>
          </Right>
        </ListItem>
      </List>
    </>
  );
};

const styles = StyleSheet.create({
  vBody: {
    width: wp('60%'),
  },
  right: {
    color: '#dc3545',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
});

export default withNavigation(ListFriend);
