import React from 'react';

import {connect} from 'react-redux';
import {TouchableOpacity, StyleSheet, Dimensions, View} from 'react-native';
import {Text, SafeAreaView} from 'src/components';
import IconTabbar from './IconTabbar';
import {CartIcon} from 'src/containers/HeaderComponent';
import {homeTabs} from 'src/config/navigator';

import {configsSelector} from 'src/modules/common/selectors';

import {grey5} from 'src/components/config/colors';
import {sizes} from 'src/components/config/fonts';
import {padding} from 'src/components/config/spacing';
const {width, height} = Dimensions.get('window');

const Tabbar = props => {
  const {
    configs,
    screenProps: {t, theme},
    navigation,
  } = props;
  const data = [
    {
      iconName: require('../../assets/images/storefront.png'),
      name: t('common:text_home'),
      router: homeTabs.home,
      isShow: true,
      type: 'material',
      image: true,
    },
    {
      iconName: require('../../assets/images/eco.png'),
      name: t('common:text_shop'),
      router: homeTabs.shop,
      isShow: true,
      type: 'material',
      image: true,
    },
    {
      iconName: require('../../assets/images/shopping_bag.png'),
      name: t('common:text_cart'),
      nameData: 'cart',
      router: homeTabs.cart,
      isShow: configs.get('toggleCheckout'),
      type: 'material',
      image: true,
    },
    {
      iconName: 'heart',
      name: t('common:text_wishList'),
      nameData: 'wishList',
      router: homeTabs.wish_list,
      // isShow: configs.get('toggleWishlist'),
      isShow: true,
    },
    {
      iconName: 'perm-identity',
      name: t('common:text_me'),
      router: homeTabs.me,
      iconProps: {
        size: 23,
      },
      isShow: true,
      type: 'material',
    },
  ];

  return (
    <SafeAreaView
      forceInset={{bottom: 'always'}}
      style={[styles.container, theme.TabNavigator.tabStyle]}>
      {/* <View style={styles.mainView}> */}
      {data.map((tab, index) =>
        tab.isShow ? (
          index !== 2 ? (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => navigation.navigate(tab.router)}>
              <IconTabbar
                type={tab.type}
                name={tab.iconName}
                color={
                  navigation.state.index === index
                    ? theme.colors.primary
                    : grey5
                }
                nameData={tab.nameData}
                {...tab.iconProps}
                image={tab.image}
              />
              <Text
                medium
                style={[
                  styles.text,
                  {
                    color:
                      navigation.state.index === index
                        ? theme.colors.primary
                        : grey5,
                  },
                ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={1}
                key={index}
                style={styles.itemCart}
                onPress={() => navigation.navigate(tab.router)}>
                {/* <ImageBackground
                style={styles.image}
                source={require('../../assets/images/hexiconactive.png')}> */}
                <View style={styles.viewStyle}>
                  <IconTabbar
                    image={tab.image}
                    type={tab.type}
                    name={tab.iconName}
                    color={
                      navigation.state.index === index
                        ? theme.colors.primary
                        : grey5
                    }
                    nameData={tab.nameData}
                    {...tab.iconProps}
                  />
                </View>
                {/* </ImageBackground> */}
              </TouchableOpacity>
              <View style={styles.item} />
            </>
          )
        ) : null,
      )}
      {/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // mainView: {
  //   flexDirection: 'row',
  //   width,
  //   height: height * 0.15,
  //   backgroundColor: 'transparent'
  // },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    height: height * 0.07,
  },
  itemCart: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: -width * 0.04,
    left: width / 2 - width * 0.065,
  },
  viewStyle: {
    elevation: 2,
    backgroundColor: 'white',
    width: width * 0.13,
    height: width * 0.13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.065,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: height * 0.005,
  },
  text: {
    fontSize: sizes.h6 - 2,
    lineHeight: 15,
    marginTop: 5,
  },
  image: {
    width: height * 0.07,
    height: height * 0.082,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    configs: configsSelector(state),
  };
};

export default connect(mapStateToProps)(Tabbar);
