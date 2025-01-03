import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import { ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../assets/images/nyt-logo.svg";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  });

  const onSelectedAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
      [Strategy.Apple]: appleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      console.log("onSelectedAuth - createdSessionId", createdSessionId);
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ alignSelf: "flex-end"}}
      >
        <Ionicons name="close" size={30} color={Colors.light.gray} />
      </TouchableOpacity>

      <Logo width={180} height={40} style={{alignSelf:'center', marginVertical: 20}}/>
      <Text style={styles.header}>Log in or create an account</Text>
      <Text style={styles.subText}>
        By continuing, you agree to the Terms of Sale, Terms of Service, and
        Privacy Policy.
      </Text>

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue with email</Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>OR</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectedAuth(Strategy.Google)}
        >
          <Ionicons name="logo-google" size={24} />
          <Text style={styles.btnOutlineText}>Continue with google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectedAuth(Strategy.Facebook)}
        >
          <Ionicons name="logo-facebook" size={24} />
          <Text style={styles.btnOutlineText}>Continue with facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectedAuth(Strategy.Apple)}
        >
          <Ionicons name="logo-apple" size={24} />
          <Text style={styles.btnOutlineText}>Continue with apple</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    // paddingTop: 10,
    paddingBottom: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 15,
    color: "#4f4f4f",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputLabel: {
    paddingBottom: 5,
    fontWeight: "500",
  },
  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "mon-sb",
    color: Colors.light.gray,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    height: 50,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 5,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  btnIcon: {
    paddingRight: 10,
  },
});
