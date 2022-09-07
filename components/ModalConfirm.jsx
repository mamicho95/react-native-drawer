import React, { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Dialog } from "@rneui/themed";
import { COLORS } from "./../Constants/Colors";
import { Btn } from "./fragments/Btn";

export const ModalTester = (data) => {
  const { setVisibleState, visibleState, deleteTask, title } = data;
  return (
    <Dialog overlayStyle={styles.modal} isVisible={visibleState}>
      <Text style={styles.modalText}>{title}</Text>
      <View style={styles.buttonsView}>
        <Btn title="Cancelar" color={COLORS.red} action={setVisibleState} />
        <Btn title="Aceptar" action={deleteTask}/>
      </View>
    </Dialog>
  );
};
const styles = StyleSheet.create({
  modal: {
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 15,
    borderRadius: 10,
  },
  modalText: {
    marginVertical: 15,
    textAlign: "center",
    color: COLORS.letters,
    fontSize: 18,
  },
  buttonsView: {
    flexDirection: "row",
  },
});
