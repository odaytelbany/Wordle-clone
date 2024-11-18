import { View, StyleSheet, Text, Image, TouchableOpacity, Switch } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { defaultStyles } from "@/constants/Styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
export type Ref = BottomSheetModal;

import disc from "@jsamr/counter-style/presets/disc";
import MarkedList from "@jsamr/react-native-li";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useMMKVBoolean } from "react-native-mmkv";
import { storage } from "./Storage";

const SettingsModal = forwardRef<Ref>((props, ref) => {
  const [dark, setDark] = useMMKVBoolean('dark-mode', storage);
  const [hard, setHard] = useMMKVBoolean('hard-mode', storage);
  const [contrast, setContrast] = useMMKVBoolean('contrast-mode', storage);

  const toggleDark = () => setDark(prev => !!!prev);
  const toggleHard = () => setDark(prev => !!!prev);
  const toggleContrast = () => setDark(prev => !!!prev);
  const snapPoints = useMemo(() => ["50%"], []);
  const { dismiss } = useBottomSheetModal();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      enableDynamicSizing= {false}
      handleComponent={null}
    >
      <BottomSheetView>
        {/* <View style={styles.contentContainer}> */}
          <View style={styles.modalBtns}>
            <Text style={styles.containerHeadline}>SETTINGS</Text>
            <TouchableOpacity onPress={() => dismiss()}>
              <Ionicons name="close" size={28} color={Colors.light.gray} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowBigText}>Hard Mode</Text>
              <Text style={styles.rowSmallText}>Make the game harder</Text>
            </View>
            <Switch
              trackColor={{ false: "#9a9a9a", true: "#000" }}
              ios_backgroundColor="#9a9a9a"
              thumbColor={hard ? '#fff' : '#fff'}
              onValueChange={setHard}
              value={hard}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowBigText}>Dark Mode</Text>
              <Text style={styles.rowSmallText}>Change the app's theme</Text>
            </View>
            <Switch
              trackColor={{ false: "#9a9a9a", true: "#000" }}
              ios_backgroundColor="#9a9a9a"
              thumbColor={dark ? '#fff' : '#fff'}
              onValueChange={setDark}
              value={dark}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowBigText}>Contarast Mode</Text>
              <Text style={styles.rowSmallText}>
                High contrast for better visibility
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#9a9a9a", true: "#000" }}
              ios_backgroundColor="#9a9a9a"
              thumbColor={contrast ? '#fff' : '#fff'}
              onValueChange={setContrast}
              value={contrast}
            />
          </View>
        {/* </View> */}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerHeadline: {
    fontSize: 18,
    padding: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "FrankRuhlLibre_800ExtraBold",
    flex: 1,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#888",
  },
  rowText: {
    flex: 1,
  },
  rowBigText: {
    fontSize: 18,
  },
  rowSmallText: {
    fontSize: 14,
    color: "#5e5e5e",
  },
});

export default SettingsModal;
