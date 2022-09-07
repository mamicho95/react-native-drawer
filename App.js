import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { COLORS } from "./Constants/Colors";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DailyTasks } from "./pages/DailyTasks";
import { OrganizeWeek } from "./pages/OrganizeWeek";
import { AddTaskModal } from "./components/OrganizeWeek/ModalAdd";
import { UpdateTaskModal } from "./components/OrganizeWeek/ModalUpdate";
import { useEffect } from "react";
import { openDatabase, createTables } from "./utils/db";
import { Icon } from "react-native-elements";

const Menu = createDrawerNavigator();

export default function App() {
  const db = openDatabase();
  useEffect(function () {
    createTables(db);
  }, []);
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.menubar} />
      <Menu.Navigator
        drawerContent={(props) => <MenuItems {...props} />}
        initialRouteName="Tareas Diarias"
        screenOptions={{ headerShown: false }}
      >
        <Menu.Screen name="Tareas Diarias" component={DailyTasks} />
        <Menu.Screen name="Organizar Semana" component={OrganizeWeek} />
        <Menu.Screen name="Nueva Tarea" component={AddTaskModal} />
        <Menu.Screen name="Editar Tarea" component={UpdateTaskModal} />
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
          title={"Dia"}
          icon={"sunny-outline"}
          screen={() => navigation.navigate("Tareas Diarias")}
        />
        <MenuButtonItem
          title={"Tareas"}
          icon={"alarm-outline"}
          screen={() => navigation.navigate("Organizar Semana")}
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
