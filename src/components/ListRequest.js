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

const ListRequest = props => {
  const {item, cancel} = props;
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
            <Button transparent onPress={cancel}>
              <Text style={styles.right}>Batalkan</Text>
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

export default withNavigation(ListRequest);
