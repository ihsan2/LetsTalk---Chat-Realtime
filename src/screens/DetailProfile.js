import React from 'react';
import Detail from '../components/DetailProfile';
import {withNavigation} from 'react-navigation';

const DetailProfile = props => {
  return (
    <>
      <Detail />
    </>
  );
};

export default withNavigation(DetailProfile);
