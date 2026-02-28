import { StyleSheet } from "react-native";

const COLORS = {
  background: "#FBF0DD",
  primary: "#61372F",
};

export default StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },

  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },

  headerOne: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  headerText: {
    textAlign: "center",
    fontFamily: "Gabriola",
    fontSize: 24,
    marginTop: -90,
    color: "#0E2347",
  },

  textCenter: {
    textAlign: "center",
  },

  logo: {
    width: 380,
    height: 476,
    marginTop: -90,
  },

  welcomeText: {
    textAlign: "center",
    fontFamily: "ConcertOne",
    fontSize: 32,
    color: "#0E2347",
    margin: 20,
  },

  welcomeImg: {
    width: 302,
    height: 378,
  },

  arialText: {
    fontFamily: "Arial",
    fontSize: 13,
    textAlign: "center",
  },

  getStartedBtn: {
    backgroundColor: "#A77A59",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },

  getStartedText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  paw: {
    height: 18,
  },

  containerdashbrd: {
    flex: 1,
    backgroundColor: "#FBF0DD",
    padding: 15,
  },
  containersearch: {
    backgroundColor: COLORS.background,
    margin: 10,
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    alignItems: "center",
  },
  input: {
    // flex: 1,
    width: "80%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#A77A59",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    borderRadius: 5,
    height: 50,
  },

  // Dashboard styles
  rowcateg: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  itemContainer: {
    alignItems: "center",
  },
  card: {
    width: 80,
    height: 80,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 80,
    height: 80,
  },
  label: {
    marginTop: 2,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemLabel: {
    marginTop: 2,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: -20,
  },

  // Explore styles
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    height: 120,
    marginHorizontal: 10,
  },
  imageBackground: {
    width: 100,
    height: 100,
    backgroundColor: "#D9C2A3",
    borderRadius: 15,
    position: "absolute",
    left: 0,
  },
  petImage: {
    width: 120,
    height: 140,
    position: "absolute",
    left: -10,
    bottom: 0,
    zIndex: 1,
  },
  petInfo: {
    flex: 1,
    backgroundColor: "#FFF",
    height: 100,
    marginLeft: 80,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  petName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  petLocation: {
    fontSize: 10,
    color: "#666",
    marginLeft: 4,
  },
  menucont: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
  },

  navBar: {
    flexDirection: "row",
    backgroundColor: "#B58D67",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: "95%",
    height: 65,
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuButton: {
    backgroundColor: "#FFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  // menu
  catbg: {
    marginTop: 100,
    width: "100%",
    height: 750,
    opacity: 0.3,
  },

  menucontainer: {
    margin: 20,
  },

  imageprofile: {
    width: 89,
    height: 87,
    borderRadius: 40,
    marginRight: 15,
  },
  profilecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  profiletext: {
    fontSize: 18,
    color: "#000",
  },
  menuButtonContainer: {
    flexDirection: "column",
    gap: 30,
    margin: 30,
  },

  menuButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    fontSize: 50,
  },

  menuText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 20,
  },
});
