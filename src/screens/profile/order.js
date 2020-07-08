import React from 'react';
import {fromJS}from 'immutable';
import { connect } from 'react-redux';
import { ScrollView, View, Dimensions } from 'react-native';
import { Header, Text, ThemedView } from 'src/components';
import Button from 'src/containers/Button';
import { TextHeader, CartIcon, IconHeader } from 'src/containers/HeaderComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductItemOrder from './order/ProductItemOrder';
import ContainerView from './order/ContainerView';
import NoteOrder from './order/NoteOrder';
import ShippingMethod from './order/ShippingMethod';
import AddressInfo from './order/AddressInfo';

import { refundOrder } from 'src/modules/order/actions';
import { refundOrderLoading } from 'src/modules/order/selectors';
import {countrySelector} from 'src/modules/common/selectors';

import styleOrder from './order/styles';
import currencyFormatter from 'src/utils/currency-formatter';
import { fromCharCode } from 'src/utils/string';
import { strDate, objectStatus } from './order/config';

import { margin } from 'src/components/config/spacing';
import * as Fonts from '../../components/config/fonts';

const { width, height } = Dimensions.get('window');

const prepareAddress = (address = {}, countries = fromJS([])) => {
  const selected = countries.find(country => country.get('code') === address.country);
  const valueCountry = selected ? fromCharCode(selected.get('name')): '';
  return {
    ...address,
    country_name: valueCountry,
  }
};

class DetailOrder extends React.Component {
  constructor(props) {
    super(props);

    const { navigation } = props;
    const order = navigation.getParam('order', {});

    this.state = {
      order: order,
      status: objectStatus(order.status),
    };
  }
  handleRefund = () => {
    const { dispatch } = this.props;
    const { order } = this.state;
    const { id, total} = order;
    dispatch(refundOrder(id, total));
  };

  renderBasic = () => {
    const { screenProps: { t }} = this.props;
    const { order, status } = this.state;
    const title = `${t('common:text_code_order')}: #${order.number}`;
    return (
      <ContainerView title={title}>
        <Text colorSecondary style={styleOrder.text}>
          {t('common:text_order')}: {strDate(order.date_created)}
        </Text>
        <Text colorSecondary style={styleOrder.text}>
          {t('profile:text_status_order')} <Text style={[styleOrder.text, { color: status.color }]}>{status.text}</Text>
        </Text>
      </ContainerView>
    );
  };

  renderOrderStatus = () => {
    const { status } = this.state;
    const { screenProps: { t }} = this.props;
    const statusArray = [t('common:text_placed'), t('common:text_processing'), t('common:text_shipping'), t('common:text_completed')];
    return (
      <View>
        <View style={styles.viewStatusText}>
          {statusArray.map((item, index) => {
            let completed = index === 0;
            switch (status.text.toLowerCase()) {
              case 'processing':
                completed = index <= 1;
                break;
              case 'on hold':
                completed = index <= 2;
                break;
              case 'completed':
                completed = index <= 3;
                break;
            }
            return (
              <View style={styles.statusText}>
                <Text
                  style={
                    completed ? styles.statusCompleted : styles.statusNormal
                  }>
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.viewStatusCircle}>
          {statusArray.map((item, index) => {
            let completed = index === 0;
            let onProgress = false;
            switch (status.text.toLowerCase()) {
              case 'processing':
                completed = index < 1;
                onProgress = index === 1;
                break;
              case 'on hold':
                completed = index < 2;
                onProgress = index === 2;
                break;
              case 'completed':
                completed = index <= 3;
                break;
            }
            if (index === 0) {
              return <View style={styles.roundCompleted}>
                  <Icon
                    name="ios-checkmark"
                    size={width * 0.06}
                    color="white"
                  />
                </View>;
            }
            return (
              <View style={styles.viewStatus}>
                <View
                  style={
                    completed || onProgress
                      ? styles.lineCompleted
                      : styles.lineNormal
                  }
                />
                <View
                  style={completed ? styles.roundCompleted : styles.roundNormal}
                >
                  {completed && <Icon name="ios-checkmark" size={width*0.06} color="white" />}
                  {onProgress && <View style={styles.innerDot} />}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    )
  }

  renderListProduct = () => {
    const {
      order: { line_items, currency },
    } = this.state;
    const { screenProps: { t }} = this.props;
    return (
      <ContainerView title={(t('common:text_order_information'))}>
        {line_items.map((item, index) => (
          <ProductItemOrder
            key={item.id}
            item={item}
            lastest={index === line_items.length - 1}
            style={index === line_items.length - 1 && styles.productLast}
            currency={currency}
          />
        ))}
      </ContainerView>
    );
  };

  renderNote = () => {
    const { screenProps: { t }} = this.props;
    const { order } = this.state;
    return (
      <ContainerView title={t('common:text_order_note')}>
        <NoteOrder id={order.id} />
      </ContainerView>
    );
  };

  renderTotal = () => {
    const { refundLoading, screenProps: { t } } = this.props;
    const { order } = this.state;

    const total = parseFloat(order.total);
    const tax = parseFloat(order.total_tax);
    const shipping_total = parseFloat(order.shipping_total);
    const discount = parseFloat(order.discount_total);
    const subtotal = total - tax - shipping_total + discount;

    const isTax = tax !== 0;
    const isShipping = shipping_total !== 0;
    const isDiscount = discount !== 0;

    return (
      <ContainerView style={styles.contentFooter}>
        <View style={styles.viewTotal}>
          <View style={styles.totalLeft}>
            <Text h6 colorThird>
              {t('common:text_subtotal')} {currencyFormatter(subtotal, order.currency)}
            </Text>
            {isTax && (
              <Text h6 colorThird>
                {t('common:text_tax')} {currencyFormatter(order.total_tax, order.currency)}
              </Text>
            )}
            {isShipping && <Text h6 colorThird>
              {t('common:text_shipping')} {currencyFormatter(order.shipping_total, order.currency)}
            </Text>}
            {isDiscount && <Text h6 colorThird>
              {t('common:text_discount')} {currencyFormatter(order.discount_total, order.currency)}
            </Text>}
          </View>
          <Text h3 medium>
            {currencyFormatter(order.total, order.currency)}
          </Text>
        </View>
        {order.status === 'completed' && <Button title="Refund" type="outline" buttonStyle={styles.button} containerStyle={styles.containerButton} loading={refundLoading} onPress={this.handleRefund} />}
      </ContainerView>
    );
  };

  render() {
    const { country, screenProps: { t }} = this.props;
    const {order} = this.state;
    const countries = country.get('data');
    // console.log('test order', JSON.stringify(order))
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_orders')} />}
          rightComponent={<CartIcon />}
        />
        <ScrollView>
          {this.renderOrderStatus()}
          {this.renderBasic()}
          {/*{this.renderShippingMethod()}*/}
          {order.shipping_lines && order.shipping_lines.length > 0 ?(
            <>
              <ShippingMethod
                feeShipping={t('common:text_fee_shipping')}
                freeShippingTax={t('common:text_free_shipping_tax')}
                title={t('common:text_shipping_method')}
                total={order.shipping_total}
                tax={order.shipping_tax}
                list={order.shipping_lines}
                currency={order.currency}
              />
              <AddressInfo
                emailText={t('inputs:text_email_address')}
                phoneText={t('profile:text_input_phone')}
                title={t('common:text_shipping_information')}
                address={prepareAddress(order.shipping, countries)}
              />
            </>
          ) : null}
          <ContainerView title={t('cart:text_payment_method')} subTitle={order.payment_method_title} />
          <AddressInfo
            title={t('cart:text_billing_address')}
            address={prepareAddress(order.billing, countries)}
            isBilling
          />
          {this.renderListProduct()}
          {order.customer_note ? <ContainerView title={t("common:text_note_order")}>
            <Text>{order.customer_note}</Text>
          </ContainerView> : null}
          {this.renderNote()}
          {this.renderTotal()}
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = {
  viewStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.01
  },
  viewStatusText: {
    width: width * 0.96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.02,
  },
  viewStatusCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.005
  },
  statusText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusNormal: {
    ...Fonts.regular,
    fontSize: 14,
  },
  statusCompleted: {
    ...Fonts.bold,
    fontSize: 14,
    color: '#4287f5',
  },
  roundNormal: {
    width: width * 0.05,
    height: width * 0.05,
    borderWidth: 2,
    borderColor: '#c5d2de',
    borderRadius: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundCompleted: {
    width: width * 0.05,
    height: width * 0.05,
    backgroundColor: '#4287f5',
    borderRadius: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: width * 0.026,
    height: width * 0.026,
    backgroundColor: '#4287f5',
    borderRadius: width * 0.013,
  },
  lineNormal: {
    width: width * 0.21,
    height: 2,
    backgroundColor: '#c5d2de',
  },
  lineCompleted: {
    width: width * 0.21,
    height: 2,
    backgroundColor: '#4287f5',
  },
  container: {
    flex: 1,
  },
  contentFooter: {
    borderBottomWidth: 0,
    alignItems: 'center',
  },
  productLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  viewTotal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: margin.big,
  },
  totalLeft: {
    flex: 1,
    marginRight: margin.base,
  },
  containerButton: {
    marginVertical: margin.base,
  },
  button: {
    paddingHorizontal: 52,
  },
};

const mapStateToProps = state => {
  return {
    refundLoading: refundOrderLoading(state),
    country: countrySelector(state),
  }
};

export default connect(mapStateToProps)(DetailOrder);
