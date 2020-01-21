import firebase from '../../../../../config/firebase';

export const setPersonData = friends => {
  return {
    type: 'FRIENDS',
    payload: friends,
  };
};

export const watchPersonData = userId => {
  return function(dispatch) {
    firebase
      .database()
      .ref('friends/' + userId)
      .on('child_added', val => {
        firebase
          .database()
          .ref('users/' + val.key)
          .on('value', snap => {
            let person = snap.val();
            person.uid = snap.key;
            dispatch(setPersonData(person));
          });
      });
  };
};
