import React from 'react';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';

import {TouchableOpacity, Image, Dimensions} from 'react-native';

import {listImageSelector} from 'src/modules/common/selectors';
import {homeDrawer} from 'src/config/navigator';
const { width , height } =  Dimensions.get('window');

const Logo = ({images, navigation, ...rest}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(homeDrawer.home_tab)}>
      <Image
        style={{
          width: 140 /480  * width,
          height: 59 /480 * width
        }}
        source={images.logo}
        resizeMode="contain"
        {...rest}
      />
    </TouchableOpacity>
  );
};

const mapStateToProps = state => {
  return {
    images: listImageSelector(state),
  };
};

export default connect(mapStateToProps)(withNavigation(Logo));
