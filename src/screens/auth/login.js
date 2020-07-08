import React from 'react';
import {connect} from 'react-redux';

import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Dimensions, Image, ImageBackground } from 'react-native';
import {Header, Divider, Text, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import SocialMethods from './containers/SocialMethods';

import {rootSwitch, authStack} from 'src/config/navigator';

import {signInWithEmail} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {requiredLoginSelector} from 'src/modules/common/selectors';
import {margin} from 'src/components/config/spacing';
import {imagesTheme} from '../../config/images';

import {changeColor} from 'src/utils/text-html';
import LoginMobile from './login-mobile';
const { width, height } = Dimensions.get('window');

const LogoHeader = () => (
  <View style={{
    height: height * 0.12, 
    backgroundColor: 'blue',
    borderBottomLeftRadius: height * 0.06, 
    borderBottomRightRadius: height * 0.06
  }}
  >

  </View>
)

class LoginScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleLogin = () => {
    const {username, password} = this.state;
    this.props.dispatch(signInWithEmail({username, password}));
  };

  render() {
    const {
      navigation,
      auth: {pending, loginError},
      requiredLogin,
      screenProps: {t, theme},
    } = this.props;
    const {username, password} = this.state;
    const {message, errors} = loginError;

    return (
      <ThemedView isFullView>
        <ImageBackground style={styles.bg} source={imagesTheme.light.loginBg}>
        {/* <LogoHeader /> */}
        <Header
          leftComponent={
            !requiredLogin && (
              <IconHeader
                name="x"
                size={24}
                onPress={() => navigation.navigate(rootSwitch.main)}
              />
            )
          }
          centerComponent={<TextHeader title={t('common:text_signin')} />}
        />
        <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
          <ScrollView>
            <Container>
              <Image style={styles.logo} source={imagesTheme.light.loginUI} />
              {message ? (
                <TextHtml
                  value={message}
                  style={changeColor(theme.colors.error)}
                />
              ) : null}
              {/* <Input
                label={t('auth:text_input_email_address')}
                value={username}
                onChangeText={value => this.setState({username: value})}
                error={errors && errors.username}
              />
              <Input
                label={t('auth:text_input_password')}
                value={password}
                secureTextEntry
                onChangeText={value => this.setState({password: value})}
                error={errors && errors.password}
              /> */}
              <LoginMobile/>
              {/* <Button
                title={t('common:text_signin')}
                loading={pending}
                onPress={this.handleLogin}
                containerStyle={styles.margin}
              /> */}
              <Container>
                {/* <Text h6 colorThird style={styles.textAccount}>
                  {t('auth:text_have_account')}
                </Text> */}
                <Button
                  buttonStyle={styles.buttonStyle}
                  title={t('auth:text_register')}
                  onPress={() => navigation.navigate(authStack.register)}
                />
              </Container>
              {/* <Text
                onPress={() => navigation.navigate(authStack.forgot)}
                style={styles.textForgot}
                medium>
                {t('auth:text_forgot')}
              </Text> */}
              <View style={[styles.viewOr, styles.margin]}>
                <Divider style={styles.divOr} />
                <Text style={styles.textOr} colorThird>
                  {t('auth:text_or')}
                </Text>
                <Divider style={styles.divOr} />
              </View>
              <SocialMethods style={styles.viewSocial} />
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
        </ImageBackground>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    width,
    height,
  },
  keyboard: {
    flex: 1,
  },
  logo: {
    width: width * 0.36,
    height: width * 0.36,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  textForgot: {
    textAlign: 'center',
  },
  viewOr: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divOr: { 
    flex: 1,
  },
  textOr: {
    marginHorizontal: margin.base,
  },
  textAccount: {
    textAlign: 'center',
    marginBottom: margin.base,
  },
  margin: {
    marginVertical: margin.big,
  },
  viewSocial: {
    marginBottom: margin.big,
  },
  buttonStyle: {
    backgroundColor: '#fbb03b',
    borderColor: '#fbb03b',
    borderRadius: 23,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    requiredLogin: requiredLoginSelector(state),
  };
};

export default connect(mapStateToProps)(LoginScreen);
