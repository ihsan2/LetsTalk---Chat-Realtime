import React from 'react';
import Map from '../components/Map';

const TabMap = props => {
  return (
    <>
      <Map
        initialPosition={props.initialPosition}
        marker={props.marker}
        refresh={props.refresh}
      />
    </>
  );
};

export default TabMap;
