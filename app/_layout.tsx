import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Appearance, Platform, Text, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cashe";
import Logo from "../assets/images/nyt-logo.svg";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useMMKVBoolean } from "react-native-mmkv";
import { storage } from "@/components/Storage";

// Load the fonts first before hiding the splash screen
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;
  const router = useRouter();
  const [dark] = useMMKVBoolean('dark-mode', storage);

  useEffect(() => {
    if (Platform.OS !== 'web'){
      Appearance.setColorScheme(dark ? 'dark' : 'light');
    }
  }, [dark])

  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: "modal",
                    title: '',
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    // headerTitle: () => <Logo width={150} height={40} />,
                    // headerRight: () => (
                    //   <TouchableOpacity onPress={() => router.back()}>
                    //     <Ionicons
                    //       name="close"
                    //       size={26}
                    //       color={Colors.light.gray}
                    //     />
                    //   </TouchableOpacity>
                    // ),
                  }}
                />
                <Stack.Screen
                  name="game"
                  options={{
                    headerBackTitle: "Wordle",
                    title: "",
                    // headerLe
                    headerLeft: () => (
                      <Text
                        style={{
                          fontSize: 26,
                          fontFamily: "FrankRuhlLibre_800ExtraBold",
                          color: textColor
                        }}
                      >
                        Wordle
                      </Text>
                    ),
                    headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
                    headerBackVisible: true,
                  }}
                />
                <Stack.Screen
                  name="end"
                  options={{
                    presentation: 'fullScreenModal',
                    title: '',
                    headerShadowVisible: false,
                    headerBackVisible: false,
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
