import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ListSearchUser = props => {
  const {item, addFriends, load} = props;
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
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ChatRoom', {item})}>
            <Body style={styles.vBody}>
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
            </Body>
          </TouchableOpacity>
          <Right>
            <Button transparent onPress={addFriends}>
              {load ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.right}>Add</Text>
              )}
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
    color: '#28a745',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
});

export default withNavigation(ListSearchUser);
