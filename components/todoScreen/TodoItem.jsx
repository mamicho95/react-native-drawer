import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { CheckBox, Icon } from "react-native-elements";
//import { CheckBox, Icon } from '@rneui/themed';
import { insertTaskDone, openDatabase, deleteTaskDone } from "../../utils/db";
import { COLORS } from "../../Constants/Colors";

export default function TodoItem(data) {
  const db = openDatabase();
  const { id, title, completed, check_date } = data.item;
  const time_check = check_date
    ? check_date.split(" ")[1].split(":")[0] +
      ":" +
      check_date.split(" ")[1].split(":")[1]
    : null;
  const handleTodoClick = async () => {
    if (completed) {
      deleteTaskDone(db, id);
      data.toggleTodo(id, null);
    } else {
      const newDateTaskDone = await insertTaskDone(db, id);
      await data.toggleTodo(id, newDateTaskDone);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handleTodoClick}>
      <View style={styles.item}>
        <View style={styles.titleContainter}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={{ alignSelf: "center" }}>
          <Text style={{ color: COLORS.letters, fontSize: 15,marginLeft:5,marginRight:-4 }}>
            {time_check}
          </Text>
        </View>
        <View style={{ alignSelf: "center" }}>
          <CheckBox
          containerStyle={{paddingHorizontal:0}}
            iconRight
            checkedIcon={
              <Icon
                name="checkbox-marked"
                type="material-community"
                color={COLORS.blue}
                size={35}
              />
            }
            uncheckedIcon={
              <Icon
                name="checkbox-blank-outline"
                type="material-community"
                color={COLORS.blue}
                size={35}
              />
            }
            checked={completed}
            onPress={handleTodoClick}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: COLORS.task,
    marginVertical: 8,
    marginHorizontal: 16,
    paddingHorizontal: 15,
    flexDirection: "row",
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    color: COLORS.letters,
  },
  titleContainter: {
    flex: 1,
    justifyContent: "center",
  },
});
