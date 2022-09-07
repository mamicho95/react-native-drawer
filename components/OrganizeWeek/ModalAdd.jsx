import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../Constants/Colors";
import { Icon } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { openDatabase, insertTask } from "../../utils/db";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Btn } from "../fragments/Btn";
export function AddTaskModal({ route, navigation }) {
  const db = openDatabase();
  const [mode, setMode] = useState("date");
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [validationForm, setValidationForm] = useState(true);
  const defaultForm = {
    title: "",
    notification: false,
    hour: new Date(),
    day: "Lunes",
  };
  const [taskForm, setTaskForm] = useState(defaultForm);
  const week = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ];
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDate(false);
    if (currentDate) {
      const newTaskForm = { ...taskForm };
      newTaskForm.hour = currentDate;
      setTaskForm(newTaskForm);
    }
  };
  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShowDate(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };
  const showTimepicker = () => {
    showMode("time");
    setShowDate(true);
  };
  const onChangeInput = (text) => {
    const newTaskForm = { ...taskForm };
    newTaskForm.title = text;
    if (text) {
      setValidationForm(true);
    }
    setTaskForm(newTaskForm);
  };
  const toggleSwitch = () => {
    const newTaskForm = { ...taskForm };
    newTaskForm.notification = !taskForm.notification;
    setTaskForm(newTaskForm);
  };
  const validateForm = async () => {
    if (taskForm.title == "") {
      setValidationForm(false);
    } else {
      const newTask = await insertTask(db, taskForm);
      //addTask(newTask);
      setTaskForm(defaultForm);
      navigation.navigate("Organizar Semana");
    }
  };
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate("Organizar Semana")}
        >
          <Icon
            name="caret-back-outline"
            type="ionicon"
            color={COLORS.letters}
            size={30}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text
          style={{
            color: COLORS.letters,
            alignSelf: "center",
            fontSize: 24,
            paddingVertical: 18,
          }}
        >
          Nueva Tarea
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nombre"
          placeholderTextColor={COLORS.task}
          selectionColor={COLORS.letters}
          color={COLORS.letters}
          onChangeText={onChangeInput}
          defaultValue={taskForm.title}
          borderColor={validationForm ? COLORS.letters : "#E43046"}
        />
        {validationForm ? (
          <View style={{ height: 25 }}></View>
        ) : (
          <View
            style={{
              backgroundColor: "#E43046",
              padding: 2,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              height: 25,
            }}
          >
            <Text style={{ color: COLORS.letters, paddingLeft: 8 }}>
              Debe ingresar un nombre
            </Text>
          </View>
        )}
        <SelectDropdown
          data={week}
          defaultValueByIndex={0}
          buttonTextStyle={styles.selectButtonTextStyle}
          buttonStyle={styles.selectButtonStyle}
          dropdownStyle={{ borderRadius: 10 }}
          rowTextStyle={{ fontSize: 15, color: COLORS.letters }}
          rowStyle={{ backgroundColor: COLORS.menubar }}
          renderDropdownIcon={() => (
            <Icon
              name="chevron-down-outline"
              type="ionicon"
              color={COLORS.task}
              size={25}
            />
          )}
          onSelect={(selectedItem, index) => {
            const newTaskForm = { ...taskForm };
            newTaskForm.day = selectedItem;
            setTaskForm(newTaskForm);
          }}
        />
        <View style={styles.inputTitle}>
          <Text style={{ color: COLORS.letters, fontSize: 18 }}>Hora</Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.background,
              padding: 5,
              borderRadius: 5,
              width: "24%",
            }}
            onPress={showTimepicker}
          >
            <Text
              style={{ color: COLORS.letters, textAlign: "center" }}
            >{`${taskForm.hour.getHours()}:${taskForm.hour.getMinutes()}`}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputTitle}>
          {showDate && (
            <DateTimePicker
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChangeDate}
              display="default"
              textColor="white"
            />
          )}
          <Text style={{ color: COLORS.letters, fontSize: 18 }}>Notificar</Text>
          <Switch onValueChange={toggleSwitch} value={taskForm.notification} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Btn title="Guardar" color={COLORS.task} action={validateForm} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 65,
    backgroundColor: COLORS.menubar,
    paddingHorizontal: 15,
  },
  form: {
    paddingHorizontal: 30,
  },
  textInput: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  selectButtonStyle: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.menubar,
    borderColor: COLORS.letters,
    borderWidth: 1,
    marginBottom: 9,
    marginTop: 5,
  },
  selectButtonTextStyle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.letters,
  },
  inputTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
