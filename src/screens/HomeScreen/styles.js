import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    detailsContainer: {
        color:'#dfdfdf',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    Heading: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 8,
    },
    DetailsSection: {
        fontSize: 23,
        fontWeight: 'bold',
        alignSelf: 'left',
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 15,
    },
    textList: {
        display: "flex",
        borderRadius: 5,
        color: 'black',
        marginLeft: 20,
        fontSize: 18,
    },
    HeadingDisplay: {
        flex: 1,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 35,
        marginLeft: 8,
    },
    HeadingList: {
        fontSize: 30,
        textAlign: 'left',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 30,
        marginRight: 8
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
    textBooking: {
        borderRadius: 5,
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 8,
        marginRight:30,
        paddingLeft: 16,
        fontWeight: 'bold',
        fontSize:16
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
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonDeal: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#8f8f8f',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20,
        height: 38,
        width:130,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonALT: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#c4c4c4',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
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
    buttonSmallHome: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#c4c4c4',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        height: 30,
        width: '45%', // updated to percentage-based width
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
    buttonBook: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#8f8f8f',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        marginBottom:10,
        height: 48,
        width: '90%',
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
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
    },
    buttonCarousel: {
        backgroundColor: "#c4c4c4",
        borderWidth: 1,
        borderColor: "transparent",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        width: 408,
        height: 200,
        marginTop: 5,
        marginBottom: 5,
    },
    displayBox: {
        backgroundColor: "#c4c4c4",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderWidth: 1,
        borderColor: "transparent",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        width: "90%",
        height: 200,
        marginLeft: "5%",
        marginTop: 5,
        marginBottom: 5,
    },
    imageDisplayBox: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderWidth: 1,
        borderColor: "transparent",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        width: "95%",
        height: 130,
        marginLeft: "5%",
        marginTop: 5,
        marginBottom: 5,
        overflow: "hidden",
    },
    imageDisplayCarousel: {
        width: 406,
        height: 130,
        marginLeft: 0,
        marginBottom: 10,
        overflow: "hidden",
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
    carouselStyle: {
        width: 410,
        height: 320,
        alignSelf: "center"
    },
})
