import {notifStack} from 'src/config/navigator';

import {createStackNavigator} from 'react-navigation-stack';

import NotificationList from 'src/screens/profile/notifications';
import NotificationDetail from 'src/screens/profile/notification';

export default createStackNavigator(
  {
    [notifStack.notification_list]: NotificationList,
    [notifStack.notification_detail]: NotificationDetail,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);
