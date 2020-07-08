import React from 'react';
import { TouchableOpacity, Dimensions, View, StyleSheet, Image, Text } from 'react-native';

const { width, height } = Dimensions.get('window')
import fonts from '../config/fonts'

const CardItem = (props) => {
    const mainContainer = props.index % 2 === 0 ? styles.leftContainer: styles.rightContiner
    return(
        <TouchableOpacity onPress={()=>props.onPress()} style={styles.container}>
            <View style={mainContainer}>
                <Image style={styles.image} source={props.centerAvatar.source}/>
                <Text style={styles.text}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: height/5,
        marginTop: 14,
    },
    leftContainer: {
        width: width*0.43,
        height: height/5,
        backgroundColor: 'white',
        elevation: 4,
        marginLeft: 5,
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: height * 0.01
    },
    rightContiner: {
        width: width*0.43,
        height: height/5,
        backgroundColor: 'white',
        elevation: 4,
        marginRight: 5,
        marginLeft: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: height * 0.01
    },
    image: {
        width: width*0.2,
        height: width*0.2,
    },
    text: {
        ...fonts.bold,
        marginTop: 3
    }
  });

export default React.memo(CardItem)