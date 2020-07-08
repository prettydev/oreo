let onNotifOpened = false;

export const setNotificationHandler = (value) => {
    console.log("setNotifListner: ", value);
    
    onNotifOpened = value;
}

export const getNotificationHandler = () => {
    return onNotifOpened;
}