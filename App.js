import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { Contacto } from "./pages/Contacto";
import { Acercade } from "./pages/Acercade";
import { Inicio } from "./pages/Inicio";

const Menu = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Menu.Navigator>
        <Menu.Screen
          name="Inicio"
          options={{
            headerTitle: "Nuevo titulo",
          }}
          component={Inicio}
        />
        <Menu.Screen name="Contacto" component={Contacto} />
        <Menu.Screen name="Acercade" component={Acercade} />
      </Menu.Navigator>
    </NavigationContainer>
  );
}