import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    profileButton:{ 
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#8f8f8f',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 345,
        marginBottom: -325,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    infoText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 20,
    },
    profileContainer: {
        padding: 10,
        width: '100%',
        height: 150
    },
    profileImage: {
        resizeMode: 'cover',
        width: 150,
        marginLeft: 20,
        marginTop: -10,
        height: 150,
        borderRadius: 100,
    },
    informationBox: {
        boxSizing: 'border-box',
        width: 530,
        height: 260,
        marginLeft: 10,
        top: -3,
        background: '#E3E3E3',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderStyle: 'solid',
    },
    userBox: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: 550,
        height: 320,
        marginLeft: 25,
        top: 10,
        background: '#E3E3E3',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderStyle: 'solid',
    },
    containerProfile: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 20,
    },
    inputProfile: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    space: {
        width: 20, // or whatever size you need
        height: 20,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign:'right',
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 8,
        marginRight: 30
    },
    text: {
        borderRadius: 5,
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 8,
        paddingLeft: 16,
        fontWeight: 'bold',
    },
    textNB: {
        borderRadius: 5,
        paddingLeft: 16,
    },
    carouselStyle: {
        width: 410,
        height: 250,
        alignSelf: "center"
    },
    Heading: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 8,
    },
    list: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 70, 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white',
        marginVertical: 4,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 16
    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    imagePlaceholder: {
        flex: 1,
        height: 70,
        width: 300,
        margin: 20,
    },
    imageDetailsPlaceholder: {
        height: 200,
        width: 400,
        alignSelf: "center"
    },
    imageBanner: {
        flex: 1,
        height: 350,
        width: 385,
        margin: 0,
        marginLeft:14
    },
    input: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    inputSearch: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 38,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    desc: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 120,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    button: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#8f8f8f',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonSmall: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: 'white',
        marginLeft: 8,
        marginRight: 8,
        marginTop: 10,
        marginBottom:10,
        height: 30,
        width: 120,
        borderRadius: 15,
    },
    buttonListLeft: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: 'white',
        marginLeft: 2,
        marginRight: 3,
        marginTop: 5,
        marginBottom:5,
        height: 30,
        width: 90,
        borderRadius: 15,
    },
    buttonListRight: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: 'white',
        marginLeft: 2,
        marginRight: 15,
        marginTop: 5,
        marginBottom:5,
        height: 30,
        width: 90,
        borderRadius: 15,
    },
    buttonSmallListText: {
        alignSelf:"center", 
        marginTop:5,
    },
    buttonSmallText: {
        alignSelf:"center", 
        marginTop:5,
        fontWeight: 'bold'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    },
    inputIOSContainer: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: 'white',
        fontSize: '20',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    inputIOS: {
        fontSize: 14
    },
    checklist: {
        flexDirection: 'row', 
        alignItems: 'center'

      },
    checkbox: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 8,
        paddingLeft: 16
    }
})
