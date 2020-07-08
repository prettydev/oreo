import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {withNavigation} from 'react-navigation';
import {compose} from 'redux';

import truncate from 'lodash/truncate';
import isEqual from 'lodash/isEqual';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {Icon, Badge, Text, ListItem} from 'src/components';
import Button from 'src/containers/Button';
import Separator from 'src/containers/Separator';
import {Row} from 'src/containers/Gird';
import {imagesTheme} from '../../../config/images';

import {authSelector} from 'src/modules/auth/selectors';

import {profileStack, authStack} from 'src/config/navigator';
import {margin, padding} from 'src/components/config/spacing';
import Fonts from '../../../components/config/fonts';

const {width, height} = Dimensions.get('window');

const HeaderMe = props => {
  const {
    navigation,
    auth: {isLogin, user},
    showData,
  } = props;
  const {t} = useTranslation();

  let nameUser = t('profile:text_hello_default');
  if (isLogin && user && !isEqual(user, {})) {
    const stringName = t('profile:text_hello', {name: user.display_name});

    nameUser = truncate(stringName, {
      length: 20,
      separator: '...',
    });
  }
  if (!isLogin) {
    if (showData) {
      return (
        <View style={styles.row}>
          <Image style={styles.logo} source={imagesTheme.light.loginUI} />
          <Button
            title={t('common:common_signin')}
            containerStyle={styles.flexDrawer}
            buttonStyle={styles.login}
            onPress={() => navigation.navigate(authStack.login)}
          />
        </View>
      );
    }
    return (
      <>
        {!showData && (
          <Text style={styles.logoutDescription} colorSecondary>
            {t('profile:text_title_logout')}
          </Text>
        )}
        {!showData && (
          <Row style={styles.logoutViewButton}>
            <Button
              title={t('profile:text_register')}
              containerStyle={styles.flex}
              type="outline"
              onPress={() => navigation.navigate(authStack.register)}
            />
            <Separator small />
            <Button
              title={t('profile:text_signin')}
              containerStyle={styles.flex}
              onPress={() => navigation.navigate(authStack.login)}
            />
          </Row>
        )}
      </>
    );
  }
  if (showData) {
    return (
      <View style={styles.row}>
        <Image style={styles.logo} source={imagesTheme.light.loginUI} />
        <Text style={styles.name}>{nameUser}</Text>
      </View>
    );
  }
  return (
    <ListItem
      title={nameUser}
      leftAvatar={{
        source: user.avatar
          ? {uri: user.avatar}
          : require('src/assets/images/pDefault.png'),
        size: 60,
        rounded: true,
        onPress: () => navigation.navigate(profileStack.account),
      }}
      titleProps={{
        medium: true,
        onPress: () => navigation.navigate(profileStack.account),
      }}
      // rightElement={
      //   <TouchableOpacity style={styles.loginBell} onPress={() => false && navigation.navigate(profileStack.notification_list)}>
      //     <Icon name="bell" size={20} />
      //     {/*<Badge status="error" value={2} badgeStyle={styles.badge} textStyle={styles.textBadge} />*/}
      //   </TouchableOpacity>
      // }
      containerStyle={styles.item}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.04,
  },
  name: {
    flex: 1,
    marginLeft: width * 0.01,
    fontSize: 18,
    ...Fonts.medium,
  },
  logoutDescription: {
    textAlign: 'center',
  },
  logoutViewButton: {
    marginTop: margin.big - 4,
    marginLeft: 0,
    marginRight: 0,
  },
  flexDrawer: {
    flex: 1,
    marginHorizontal: width * 0.05,
    height: height * 0.065,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    width: width * 0.38,
  },
  flex: {
    flex: 1,
  },
  loginBell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    paddingVertical: padding.large + 4,
  },
  badge: {
    height: 20,
    minWidth: 20,
    borderRadius: 10,
  },
  textBadge: {
    fontSize: 9,
    lineHeight: 20,
  },
  logo: {
    width: width * 0.21,
    height: width * 0.21,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
  };
};

export default compose(
  withNavigation,
  connect(mapStateToProps),
)(HeaderMe);
