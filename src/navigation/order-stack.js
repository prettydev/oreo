import { createStackNavigator } from 'react-navigation-stack';

import OrderList from 'src/screens/profile/orders';
import OrderDetail from 'src/screens/profile/order';
import { profileStack } from 'src/config/navigator';

export default createStackNavigator(
    {
        [profileStack.order_list]: OrderList,
        [profileStack.order_detail]: OrderDetail,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
)