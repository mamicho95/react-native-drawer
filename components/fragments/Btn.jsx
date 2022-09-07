import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "./../../Constants/Colors";

export function Btn(data) {
  const { title, color, action } = data;
  const styles = StyleSheet.create({
    button: {
      flex: 1,
      borderRadius: 40,
      alignItems: "center",
      backgroundColor: color ? color : COLORS.task,
      padding: 10,
      marginTop: 15,
    },
  });
  return (
    <TouchableOpacity style={styles.button} onPress={action}>
      <Text style={{ color: COLORS.letters }}>{title}</Text>
    </TouchableOpacity>
  );
}
