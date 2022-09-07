import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Icon } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { COLORS } from "./Constants/Colors";
import { Contacto } from "./pages/Contacto";
import { Acercade } from "./pages/Acercade";
import { Inicio } from "./pages/Inicio";


const Menu = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.menubar} />
      <Menu.Navigator
        drawerContent={(props) => <MenuItems {...props} />}
        initialRouteName="Inicio"
        screenOptions={{ headerShown: true }}
      >
        <Menu.Screen name="Inicio" component={Inicio} />
        <Menu.Screen name="Contacto" component={Contacto} />
        <Menu.Screen name="Acercade" component={Acercade} />
      </Menu.Navigator>
    </NavigationContainer>
  );
}
const MenuButtonItem = ({ title, screen, icon }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={screen}>
      <Icon
        style={{ padding: 6 }}
        name={icon}
        type="ionicon"
        color={COLORS.blue}
        size={27}
      />
      <Text style={{ color: COLORS.letters, fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
};
const MenuItems = ({ navigation }) => {
  return (
    <DrawerContentScrollView style={styles.scrollView}>
      <View style={styles.iconContainer}>
        <Text style={styles.title}>Huevito APP</Text>
        <Image
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            marginVertical: 10,
          }}
          source={{
            uri: "https://static.wikia.nocookie.net/huevito-rey/images/c/c5/Huevo.jpg/revision/latest/scale-to-width-down/250?cb=20211001200004&path-prefix=es",
          }}
        />
      </View>
      <View style={styles.itemsContainer}>
        <MenuButtonItem
          title={"Inicio"}
          icon={"sunny-outline"}
          screen={() => navigation.navigate("Inicio")}
        />
        <MenuButtonItem
          title={"Contacto"}
          icon={"alarm-outline"}
          screen={() => navigation.navigate("Contacto")}
        />
        <MenuButtonItem
          title={"Acercade"}
          icon={"alarm-outline"}
          screen={() => navigation.navigate("Acercade")}
        />
      </View>
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.menubar,
  },
  iconContainer: {
    alignItems: "center",
  },
  itemsContainer: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    backgroundColor: COLORS.dateBar,
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 7,
  },
  title: {
    fontSize: 20,
    color: COLORS.letters,
    textAlign: "center",
    paddingVertical: 10,
    fontWeight: "bold",
  },
});
