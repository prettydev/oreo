import React from 'react';
import {connect} from 'react-redux';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ImageBackground,
} from 'react-native';
import options from 'src/config/config-rate';
import {ThemedView, ListItem} from 'src/components';
import ItemCategoryMenu from './ItemCategoryMenu';
import unescape from 'lodash/unescape';

import HeaderMe from '../screens/profile/containers/HeaderMe';
import LinearGradient from 'react-native-linear-gradient';

import {categorySelector} from 'src/modules/category/selectors';
import {authSelector} from 'src/modules/auth/selectors';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';

import {padding, margin} from 'src/components/config/spacing';

import {homeDrawer, profileStack} from 'src/config/navigator';
import {excludeCategory} from '../utils/category';
import {exclude_categories_sidebar} from '../config/category';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Fonts from '../components/config/fonts';
import {imagesTheme} from '../config/images';
import Rate, {AndroidMarket} from 'react-native-rate';
import {signOut} from 'src/modules/auth/actions';

const {width, height} = Dimensions.get('window');

const dataHelpInfo = [
  {
    id: '1',
    name: 'common:text_home',
    router: homeDrawer.home_tab,
  },
  {
    id: '2',
    name: 'common:text_blogs',
    router: homeDrawer.blog,
  },
  {
    id: '3',
    name: 'common:text_about',
    router: profileStack.about,
  },
  {
    id: '4',
    name: 'common:text_contact',
    router: profileStack.contact,
  },
  {
    id: '5',
    name: 'common:text_privacy_full',
    router: profileStack.privacy,
  },
];

class Sidebar extends React.Component {
  handlePage = (router, params = {}) => {
    const {navigation} = this.props;
    if (!navigation) {
      return null;
    }
    navigation.navigate(router, params);
  };

  render() {
    const {
      category,
      navigation,
      configs,
      language,
      auth: {isLogin, user},
      screenProps: {t},
      handleSignOut,
    } = this.props;

    const {data} = category;

    const titleProps = {
      medium: true,
    };

    // Filter include category
    const _data = excludeCategory(data, exclude_categories_sidebar);

    return (
      <ThemedView isFullView>
        {/* <LinearGradient colors={['#c1e866', '#94bb3d', '#94bb3d']} style={styles.container}> */}
        <ImageBackground style={styles.bg} source={imagesTheme.light.loginBg}>
          <View style={styles.container}>
            <HeaderMe showData />
            {/* <Text h3 medium style={[styles.title, styles.titleHead]}>
            {t('common:text_category')}
          </Text>
          {_data.map(c => (
            <ItemCategoryMenu
              key={c.id}
              category={c}
              isOpen={navigation.state && navigation.state.isDrawerOpen ? navigation.state.isDrawerOpen : false}
              goProducts={this.handlePage}
            />
          ))} */}
            {/* <Text h3 medium style={styles.title}>
            {t('common:text_help')}
          </Text> */}
            <View style={styles.margin}>
              {dataHelpInfo.map(value => (
                <ListItem
                  key={value.id}
                  title={t(value.name)}
                  titleProps={{
                    medium: true,
                  }}
                  small
                  containerStyle={styles.item}
                  onPress={() => this.handlePage(value.router)}
                />
              ))}
              <ListItem
                title={t('profile:text_rate_app')}
                titleProps={titleProps}
                containerStyle={styles.item}
                onPress={() => {
                  Rate.rate(options, success => {
                    if (success) {
                      // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                      this.setState({rated: true});
                    }
                  });
                }}
              />
            </View>
            {isLogin && (
              <TouchableOpacity
                onPress={() => handleSignOut()}
                style={styles.logout}>
                <Text style={styles.alignEnd}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
        {/* </LinearGradient> */}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    height,
    resizeMode: 'stretch',
  },
  title: {
    marginTop: margin.big + 4,
    marginBottom: margin.small + 1,
    paddingHorizontal: padding.large,
  },
  titleHead: {
    paddingTop: getStatusBarHeight(),
  },
  item: {
    paddingHorizontal: width * 0.08,
    backgroundColor: 'transparent',
  },
  margin: {
    flex: 1,
    marginTop: height * 0.03,
  },
  alignEnd: {
    ...Fonts.medium,
  },
  logout: {
    paddingVertical: padding.large,
    borderTopWidth: 0.5,
    borderColor: 'grey',
    paddingHorizontal: width * 0.08,
  },
});

const mapStateToProps = state => ({
  category: categorySelector(state),
  configs: configsSelector(state),
  auth: authSelector(state),
  language: languageSelector(state),
});
const mapDispatchToProps = {
  handleSignOut: signOut,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
