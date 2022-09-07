import React, { useCallback, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import TodoList from "../components/todoScreen/TodoList";
import { COLORS } from "../Constants/Colors";
import { openDatabase, getTasksOfDay } from "../utils/db";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { getStatusBarHeight } from "react-native-status-bar-height";

function orderTodos(todos) {
  todos
    .sort((a, b) => {
      let fa = a.title.toLowerCase(),
        fb = b.title.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    })
    .sort((a, b) => a.completed - b.completed);
  return todos;
}
function formatDate(date) {
  const newDate = date.toDateString().split(" ");
  switch (newDate[0]) {
    case "Mon":
      newDate[0] = "Lunes";
      break;
    case "Tue":
      newDate[0] = "Martes";
      break;
    case "Wed":
      newDate[0] = "Miercoles";
      break;
    case "Thu":
      newDate[0] = "Jueves";
      break;
    case "Fri":
      newDate[0] = "Viernes";
      break;
    case "Sat":
      newDate[0] = "Sabado";
      break;
    case "Sun":
      newDate[0] = "Domingo";
      break;
    default:
      newDate[0] = "Error";
  }
  switch (newDate[1]) {
    case "Jan":
      newDate[1] = "Enero";
      break;
    case "Fe,":
      newDate[1] = "Febrero";
      break;
    case "Mar":
      newDate[1] = "Marzo";
      break;
    case "Apr":
      newDate[1] = "Abril";
      break;
    case "May":
      newDate[1] = "Mayo";
      break;
    case "Jun":
      newDate[1] = "Junio";
      break;
    case "Jul":
      newDate[1] = "Julio";
      break;
    case "Aug":
      newDate[1] = "Agosto";
      break;
    case "Sep":
      newDate[1] = "Septiembre";
      break;
    case "Oct":
      newDate[1] = "Octubre";
      break;
    case "Nov":
      newDate[1] = "Noviembre";
      break;
    case "Dec":
      newDate[1] = "Diciembre";
      break;
    default:
      newDate[1] = "Error";
  }
  return `${newDate[0]}, ${newDate[2]} de ${newDate[1]} de ${newDate[3]}`;
}
export function DailyTasks({ navigation }) {
  const todayDate = new Date();
  const db = openDatabase();
  const [todos, setTodos] = useState([]);
  const toggleTodo = (id, dateTask) => {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    todo.check_date = dateTask;
    setTodos(orderTodos(newTodos));
  };
  const focusEffect = useCallback(() => {
    const fetchData = async () => {
      setTodos(orderTodos(await getTasksOfDay(db)));
    };
    fetchData();
  }, []);
  useFocusEffect(focusEffect);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.toggleDrawer()}
        >
          <Icon
            name="menu-outline"
            type="ionicon"
            color={COLORS.letters}
            size={30}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: COLORS.letters }}>
          Tareas diarias
        </Text>
      </View>
      <View style={styles.dateView}>
        <Text style={styles.date}>{formatDate(todayDate)}</Text>
        <Text style={styles.counter}>{`${
          todos.filter((todo) => todo.completed).length
        }/${todos.length}`}</Text>
      </View>

      <TodoList todos={todos} toggleTodo={toggleTodo} setTodos={setTodos} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    backgroundColor: COLORS.menubar,
    paddingHorizontal: 15,
  },
  dateView: {
    backgroundColor: COLORS.dateBar,
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  date: {
    fontSize: 18,
    color: COLORS.letters,
  },
  counter: {
    color: COLORS.letters,
    fontSize: 15,
  },
});
