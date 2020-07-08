import React from 'react';

import {connect} from 'react-redux';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  ScrollView,
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Header, Loading, Text, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import InputMobile from 'src/containers/input/InputMobile';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import ModalVerify from './containers/ModalVerify';
import SocialMethods from './containers/SocialMethods';

import {signUpWithEmail, signUpWithOtp} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {validatorRegister} from 'src/modules/auth/validator';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';
import {checkPhoneNumber, checkInfo} from 'src/modules/auth/service';

import {authStack} from 'src/config/navigator';
import {margin, padding} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';
import {changeColor} from 'src/utils/text-html';
import {showMessage} from 'react-native-flash-message';
import {INITIAL_COUNTRY} from 'src/config/config-input-phone-number';
import * as SendOtp from '../../utils/smsOtp';

class RegisterScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {
        first_name: '',
        last_name: '',
        name: '',
        email: '',
        password: '',
        phone_number: '',
        country_no: '',
        subscribe: false,
      },
      user: null,
      confirmResult: null,
      visibleModal: false,
      loading: false,
      error: {
        message: null,
        errors: null,
      },
      completePhoneSignIn: false,
    };
    this.confirmation = null;
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const {data} = this.state;
        this.setState({
          user,
          data: {...data, phone_number: user.phoneNumber},
        });
      }
      if (this.state.confirmResult && Platform.OS === 'android') {
        // this.register();
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  changeData = (value) => {
    this.setState({
      data: {
        ...this.state.data,
        ...value,
      },
    });
  };

  register = () => {
    this.setState({
      loading: true,
    });
    const {enablePhoneNumber} = this.props;
    const {data} = this.state;
    let payload = data;
    if (enablePhoneNumber) {
      const user_phone_number = data.phone_number.includes(data.country_no)
        ? data.phone_number
        : data.country_no + data.phone_number;
      payload = Object.assign(data, {
        enable_phone_number: true,
        digits_phone: user_phone_number,
        digt_countrycode: data.country_no,
        digits_phone_no: data.phone_number,
      });
    }
    this.setState({loading: false});
    this.props.dispatch(signUpWithEmail(payload));
  };

  completePhoneSignIn = () => {
    this.setState({completePhoneSignIn: true, confirmResult: false});
  };

  signinwithPhonenumberFirebase = async () => {
    this.setState({
      loading: true,
    });
    const {data, user} = this.state;
    const {phone_number, country_no} = data;
    const user_phone_number = phone_number.includes(country_no) ? phone_number : country_no + phone_number;
    await checkPhoneNumber({
      digits_phone: user_phone_number,
      type: 'register',
    });
      // Send Verify token
    const confirmResult = await firebase
      .auth()
      .signInWithPhoneNumber(user_phone_number);
    this.setState({
      confirmResult,
      loading: false,
    });
  };

  signinwithPhonenumber = async () => {
    this.setState({
      loading: true,
    });
    const {
      screenProps: {t},
    } = this.props;
    const {data, user} = this.state;
    const {phone_number, country_no} = data;
    const user_phone_number = phone_number.includes(country_no) ? phone_number : country_no + phone_number;
    await checkPhoneNumber({
      digits_phone: user_phone_number,
      type: 'register',
    });
      // Send Verify token
      const minm = 100000;
      const maxm = 999999;
      const otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
      const msg = `${t('common:text_otp')}${otp}`
      const response = await SendOtp.sendOtp(msg, user_phone_number);
    // const confirmResult = await firebase
    //   .auth()
    //   .signInWithPhoneNumber(user_phone_number);
    this.setState({
      confirmResult: response,
      loading: false,
      otp,
    });
  };

  handleButtonClick = () => {
    const { completePhoneSignIn } = this.state;
    if (completePhoneSignIn) {
      this.handleRegister();
    } else {
      this.signinwithPhonenumber();
    }
  };

  handleRegister = async () => {
    this.setState({
      loading: true,
    });
    const {data, user} = this.state;
    const {phone_number, country_no, first_name, last_name, email, name, password} = data;
    console.log("Data: ", data);

    const player_id = await AsyncStorage.getItem('user_token');
    console.log('user_token: ', player_id);
    
    const user_phone_number = phone_number.includes(country_no)
          ? phone_number
          : country_no + phone_number;
        await checkPhoneNumber({
          digits_phone: user_phone_number,
          type: 'register',
        }); 
        const url = `https://twbparts.com/greenba/webservices/otp_verification.php?username=${name}&email=${email}&phone_number=${user_phone_number}&password=${password}&confirm_password=${password}&mode=registration&varification_code=${this.state.otp}&valid_varification_code=${this.state.otp}&first_nmae=${first_name}&last_name=${last_name}&player_id=${player_id}`
        this.props.dispatch(signUpWithOtp(url))
  }

  /**
   * Handle User register
   */
  handleRegisterTemp = async () => {
    this.setState({
      loading: true,
    });
    try {
      const {
        screenProps: {t},
        language,
        enablePhoneNumber,
      } = this.props;
      const {data, user} = this.state;
      const {phone_number, country_no} = data;
      // Register with phone number
      if (enablePhoneNumber) {
        // Get user phone number
        const user_phone_number = phone_number.includes(country_no)
          ? phone_number
          : country_no + phone_number;
        await checkPhoneNumber({
          digits_phone: user_phone_number,
          type: 'register',
        });
        if (!user) {
          // Send Verify token
          const confirmResult = await firebase
            .auth()
            .signInWithPhoneNumber(user_phone_number);
          this.setState({
            confirmResult,
          });
        } else {
          this.register();
        }
      } else {
        this.register();
      }
    } catch (e) {
      showMessage({
        message: e.message,
        type: 'danger',
      });
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {
      navigation,
      auth: {pending},
      screenProps: {t, theme},
      enablePhoneNumber,
    } = this.props;
    const {
      data: {
        email,
        first_name,
        last_name,
        name,
        phone_number,
        country_no,
        password,
        subscribe,
      },
      error: {message, errors},
      visibleModal,
      loading,
      user,
      confirmResult,
      completePhoneSignIn,
    } = this.state;
    const visible = visibleModal || !!(!user && confirmResult);
    return (
      <ThemedView isFullView>
        <Loading visible={pending} />
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_register')} />}
        />
        <KeyboardAvoidingView
          behavior="height"
          style={styles.keyboard}
          // contentContainerStyle={{flex: 1}}
        >
          <ScrollView>
            <Container>
              {message ? (
                <TextHtml
                  value={message}
                  style={changeColor(theme.colors.error)}
                />
              ) : null}
              { completePhoneSignIn && <View>
                <Input
                  label={t('auth:text_input_first_name')}
                  value={first_name}
                  onChangeText={(value) => this.changeData({first_name: value})}
                  error={errors && errors.first_name}
                />
                <Input
                  label={t('auth:text_input_last_name')}
                  value={last_name}
                  onChangeText={(value) => this.changeData({last_name: value})}
                  error={errors && errors.last_name}
                />
                <Input
                  label={t('auth:text_input_user')}
                  value={name}
                  onChangeText={(value) => this.changeData({name: value})}
                  error={errors && errors.name}
                />
                <Input
                  label={t('auth:text_input_email')}
                  value={email}
                  onChangeText={(value) => this.changeData({email: value})}
                  error={errors && errors.email}
                />
                <Input
                  label={t('auth:text_input_password')}
                  value={password}
                  secureTextEntry
                  onChangeText={(value) => this.changeData({password: value})}
                  error={errors && errors.password}
                />
                <View style={styles.viewSwitch}>
                  <Text style={styles.textSwitch} colorSecondary>
                    {t('auth:text_agree_register')}
                  </Text>
                  <Switch
                    value={subscribe}
                    onValueChange={(value) => this.changeData({subscribe: value})}
                  />
                </View>
              </View> }
              {enablePhoneNumber && !completePhoneSignIn ? (
                <View style={styles.phonenumberView}>
                  <InputMobile
                    value={phone_number}
                    initialCountry={INITIAL_COUNTRY}
                    onChangePhoneNumber={({value, code}) =>
                      this.changeData({phone_number: value, country_no: code})
                    }
                    error={errors && errors.phone_number}
                  />
                </View>
              ) : null}
              <Button
                title={t('auth:text_register')}
                onPress={this.handleButtonClick}
                loading={loading || pending}
              />
              <SocialMethods style={styles.viewAccount} />
              <Text
                medium
                style={styles.textHaveAccount}
                onPress={() => navigation.navigate(authStack.login)}>
                {t('auth:text_already_account')}
              </Text>
              <ModalVerify
                visible={visible}
                type={'register'}
                phone={
                  phone_number.includes(country_no)
                    ? phone_number
                    : country_no + phone_number
                }
                otp={this.state.otp}
                resendOtp={this.handleButtonClick}
                confirmation={confirmResult}
                handleVerify={this.completePhoneSignIn}
                setModalVisible={(visibleModal) =>
                  this.setState({
                    visibleModal,
                    loading: false,
                    confirmResult: null,
                  })
                }
              />
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  phonenumberView: {
    marginVertical: 20,
  },
  viewSwitch: {
    marginVertical: margin.big,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textSwitch: {
    flex: 1,
    lineHeight: lineHeights.h4,
    marginRight: margin.large,
  },
  viewAccount: {
    marginVertical: margin.big,
  },
  textHaveAccount: {
    paddingVertical: padding.small,
    marginTop: margin.base,
    marginBottom: margin.big,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  const configs = configsSelector(state);
  return {
    auth: authSelector(state),
    language: languageSelector(state),
    enablePhoneNumber: configs.get('toggleLoginSMS'),
  };
};

export default connect(mapStateToProps)(RegisterScreen);
