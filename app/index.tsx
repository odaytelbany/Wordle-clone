import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Icon from "@/assets/images/wordle-icon.svg";
import { Link } from "expo-router";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import SubscribeModal from "@/components/SubscribeModal";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Index() {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const subscribeModalRef = useRef<BottomSheetModal>(null);
  const handlePresentSubscribeModalPress = () =>
    subscribeModalRef.current?.present();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SubscribeModal ref={subscribeModalRef} />

      <Animated.View style={styles.header} entering={FadeInDown}>
        <Icon width={100} height={100} />
        <ThemedText style={styles.title}>Wordle</ThemedText>
        <ThemedText style={styles.text}>
          Get 6 chances to guess a 5-letters word.
        </ThemedText>
      </Animated.View>

      <View style={styles.menu}>
        <Link
          href={"/game"}
          style={[
            styles.btn,
            { backgroundColor: colorScheme === "light" ? "#000" : "#4a4a4a" },
          ]}
          asChild
        >
          <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
            <Text style={[styles.btnText, { color: "#fff" }]}>Play</Text>
          </AnimatedTouchableOpacity>
        </Link>
        <SignedOut>
          <Link
            href={"/login"}
            style={[styles.btn, { borderColor: textColor }]}
            asChild
          >
            <AnimatedTouchableOpacity entering={FadeInLeft.delay(200)}>
              <ThemedText style={styles.btnText}>Log in</ThemedText>
            </AnimatedTouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <AnimatedTouchableOpacity
          entering={FadeInLeft.delay(200)}
            style={[styles.btn, { borderColor: textColor }]}
            onPress={() => signOut()}
          >
            <ThemedText style={styles.btnText}>Sign out</ThemedText>
          </AnimatedTouchableOpacity>
        </SignedIn>

        <AnimatedTouchableOpacity
          entering={FadeInLeft.delay(300)}
          onPress={handlePresentSubscribeModalPress}
          style={[styles.btn, { borderColor: textColor }]}
        >
          <ThemedText style={styles.btnText}>Subscribe</ThemedText>
        </AnimatedTouchableOpacity>
      </View>

      {/* <View style={styles.footer}></View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 50,
    gap: 40,
  },
  // Header
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  // Menu
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    width: "60%",
    maxWidth: 200,
    borderRadius: 30,
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: "semibold",
    color: "#333",
  },
  primaryItem: {
    backgroundColor: "#000",
  },
  primaryText: {
    color: "#fff",
  },
  // Footer
  footer: {},
});
