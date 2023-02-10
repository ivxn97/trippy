import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    profileButton: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 300,
        marginBottom: -290,
        backgroundColor: "#8f8f8f",
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    infoText: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 20,
        
    },
    map: {
        width: '100%',
        height: '85%',
    },
    buttonLanding: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginVertical: 4,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    profileContainer: {
        padding: 10,
        width: '100%',
        height: 150
    },
    profileImage: {
        display: "flex",
        resizeMode: "cover",
        width: 100,
        height: 100,
        borderRadius: 100,
        marginLeft: 10,
        marginTop: -10
    },
    informationBox: {
        display: "flex",
        boxSizing: "border-box",
        width: "95%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 5,
        top: -3,
        background: "#E3E3E3",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "grey",
        borderStyle: "solid",
    },
    userBox: {
        display: "flex",
        boxSizing: "border-box",
        position: "absolute",
        top: 10,
        left: 22,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "90%",
        
        height: "auto",
        background: "#E3E3E3",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "grey",
        borderStyle: "solid",
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
        textAlign: 'right',
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 8,
        marginRight: 30
    },
    textList: {
        display: "flex",
        borderRadius: 5,
        color: 'black',
        marginLeft: 20,
        fontSize: 18,
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
    textBooking: {
        borderRadius: 5,
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 8,
        marginRight: 30,
        paddingLeft: 16,
        fontWeight: 'bold',
        fontSize: 16
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
    HeadingList: {
        fontSize: 30,
        textAlign: 'right',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 8,
        marginRight: 30
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
        marginLeft: 14
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
    buttonList: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: '#acacab',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
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
        marginBottom: 10,
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
        marginBottom: 5,
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
        marginBottom: 5,
        height: 30,
        width: 90,
        borderRadius: 15,
    },
    buttonSmallListText: {
        alignSelf: "center",
        marginTop: 5,
    },
    buttonSmallText: {
        alignSelf: "center",
        marginTop: 5,
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
