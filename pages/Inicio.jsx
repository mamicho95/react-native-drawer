import { FlatList, Text, StyleSheet, View } from "react-native";
import { useState } from "react";

function Separator() {
  return (
    <View style={{ width: "100%", height: 1, backgroundColor: "#f3f3f3" }} />
  );
}

export function Inicio() {
  const [items, setItems] = useState(
    Array.from(Array(50), (e, i) => "Item #" + i)
  );
  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
