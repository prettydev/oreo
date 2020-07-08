// @flow
import React from 'react';

import {TouchableOpacity, Animated, View, Image} from 'react-native';

import {compose} from 'recompose';
import {connect} from 'react-redux';
import {withNavigation, NavigationScreenProps} from 'react-navigation';
import IconTabbar from '../Tabbar/IconTabbar';

import {Badge, Icon} from 'src/components';
// import Icon from 'react-native-vector-icons/Feather';

import {homeTabs} from 'src/config/navigator';

import {cartSizeSelector} from 'src/modules/cart/selectors';
import {configsSelector} from 'src/modules/common/selectors';

type Props = {
  value: number,
  isAnimated: boolean,
  navigation: NavigationScreenProps,
};

class CartIcon extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      scale: new Animated.Value(1),
    };
  }
  UNSAFE_componentWillMount() {
    if (this.props.isAnimated) {
      this.animated();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value < this.props.value) {
      this.animated();
    }
  }
  animated = () => {
    const {scale} = this.state;
    const toValue = scale._value === 1 ? 1.5 : 1;
    Animated.timing(scale, {
      toValue: toValue,
    }).start(() => {
      if (toValue === 1.5) {
        this.animated();
      }
    });
  };
  render() {
    const {
      value,
      iconProps,
      navigation,
      configs,
      tabbar,
      name,
      color,
      nameData,
      isLogin,
      ...rest
    } = this.props;
    const heightBadge = 16;

    const badgeStyle = {
      borderRadius: heightBadge / 2,
      minWidth: heightBadge,
    };

    const textStyle = {
      textAlign: 'center',
      fontSize: 8,
    };
    if (!configs.get('toggleCheckout')) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => tabbar && navigation.navigate(homeTabs.cart)}
        style={{flexDirection: 'row', alignItems: 'center', padding: 6}}>
        {tabbar ? (
          <IconTabbar name={name} color={color} nameData={nameData} {...rest} />
        ) : (
          <TouchableOpacity
            style={styles.loginBell}
            hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
            onPress={() =>
              isLogin && navigation.navigate(homeTabs.notification)
            }>
            {/* <Icon name="bell" size={20} /> */}
            <Image
              style={{width: 22, height: 22}}
              source={require('../../assets/images/notification.png')}
            />
            {/*<Badge status="error" value={2} badgeStyle={styles.badge} textStyle={styles.textBadge} />*/}
          </TouchableOpacity>
        )}
        {tabbar && (
          <View style={{position: 'absolute', top: 0}}>
            <Animated.View
              style={{
                transform: [{scale: this.state.scale}],
                zIndex: 9999,
              }}>
              <Badge
                status="error"
                badgeStyle={badgeStyle}
                textStyle={textStyle}
                value={value}
              />
            </Animated.View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

CartIcon.defaultProps = {
  value: 0,
  isAnimated: false,
  iconProps: {},
};

const mapStateToProps = state => ({
  value: cartSizeSelector(state),
  configs: configsSelector(state),
});

export default compose(
  withNavigation,
  connect(mapStateToProps),
)(CartIcon);
