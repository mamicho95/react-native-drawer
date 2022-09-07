import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { COLORS } from "../Constants/Colors";
import Accordion from "react-native-collapsible/Accordion";
import { getTasksWeek, openDatabase } from "../utils/db";
import { useFocusEffect } from "@react-navigation/native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export function OrganizeWeek({ navigation }) {
  const [tasks, setTasks] = useState();
  const [state, setState] = useState({
    activeSections: [],
  });
  const db = openDatabase();
  const focusEffect = useCallback(function () {
    const fetchData = async () => {
      setTasks(await getTasksWeek(db));
    };
    fetchData();

  }, []);
  useFocusEffect(focusEffect);

  const _renderHeader = (tasks) => {
    if (tasks.title && tasks.data) {
      return (
        <View style={styles.card}>
          <View style={styles.item}>
            <Text style={styles.title}>{tasks.title}</Text>
            <View>
              <Icon
                name="calendar-check-outline"
                type="material-community"
                color={COLORS.blue}
                size={31}
              />
              <View
                style={{
                  justifyContent: "center",
                  position: "absolute",
                  marginLeft: 15,
                  top: -7,
                  backgroundColor: COLORS.menubar,
                  borderRadius: 50,
                  width: 20,
                  height: 20,
                }}
              >
                <Text
                  style={{
                    color: COLORS.letters,
                    alignSelf: "center",
                    fontSize: 12,
                  }}
                >
                  {tasks.data.length}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  };
  const _renderContent = (section) => {
    if (section.data) {
      return section.data.map((item) => {
        return (
          <View style={styles.subitem} key={item.id}>
            <View style={styles.titleContainter}>
              <Text style={styles.subtitle}>{item.title}</Text>
            </View>
            <View style={{ alignSelf: "center" }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Editar Tarea", {
                    taskItem: item
                  })
                }
              >
                <Icon
                  name="playlist-edit"
                  type="material-community"
                  color={COLORS.blue}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    } else {
      return <View></View>;
    }
  };
  const _updateSections = (activeSections) => {
    setState({ activeSections });
  };
  return (
    <View style={styles.screen}>
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
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Nueva Tarea")
          }
        >
          <Icon
            reverse
            name="plus"
            type="octicon"
            color={COLORS.task}
            size={20}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          {tasks ? (
            <Accordion
              sections={tasks}
              activeSections={state.activeSections}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
              underlayColor={"rgba(0,0,0,0)"}
              keyExtractor={(item) => item.title}
            />
          ) : null}
        </View>
      </ScrollView>
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.task,
    padding: '5%',
    marginVertical: '1.5%',
    borderRadius: 16,
  },
  subitem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.dateBar,
    padding: 16,
    marginVertical: 4,
    borderRadius: 16,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    color: COLORS.letters,
  },
  subtitle: {
    color: COLORS.letters,
    fontSize: 18,
  },
  card: {
    borderRadius: 16,
  },
  titleContainter: {
    flex: 1,
    justifyContent: "center",
  },
});
