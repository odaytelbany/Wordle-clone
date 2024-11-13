import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Icon from "@/assets/images/wordle-icon.svg";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as MaliComposer from "expo-mail-composer";

const Page = () => {
  const { win, word, gameField } = useLocalSearchParams<{
    win: string;
    word: string;
    gameField?: string;
  }>();

  const router = useRouter();
  const [userScore, setUserScore] = useState<any>({
    played: 42,
    wins: 32,
    currentStreak: 2,
  });

  const shareGame = () => {
    const game = JSON.parse(gameField!);
    const imageText: string[][] = [];

    const wordLetters = word.split('');

    game.forEach((row: [], rowIndex: number) => {
      imageText.push([]);
      row.forEach((letter, index) => {
        if (letter === wordLetters[index]) {
          imageText[rowIndex].push('🟩');
        } else if (wordLetters.includes(letter)) {
          imageText[rowIndex].push('🟨');
        } else {
          imageText[rowIndex].push('⬜');
        }
      });
    });

    const htmlText = `
      <html>
        <head>
          <style type="text/css">
            .game {
              display: flex;
              flex-direction: column;
            }
              .row {
              display: flex;
              flex-direction: row;

              }
            .cell {
              display: flex;
              justify-content: center;
              align-items: center;
            }

          </style>
        </head>
        <body>
          <h1>Wordle</h1>
          <div class="game">
           ${imageText
             .map(
               (row) =>
                 `<div class="row">${row
                   .map((cell) => `<div class="cell">${cell}</div>`)
                   .join('')}</div>`
             )
             .join('')}
          </div>
        </body>
      </html>
    `;

    MaliComposer.composeAsync({
      subject: `I just played Wordle!`,
      body: htmlText,
      isHtml: true,
    });
  };

  const navigationRoot = () => {
    router.dismissAll();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={navigationRoot}
        style={{ alignSelf: "flex-end" }}
      >
        <Ionicons name="close" size={30} color={Colors.light.gray} />
      </TouchableOpacity>
      <View style={styles.header}>
        {win === "true" ? (
          <Image source={require("@/assets/images/win.png")} />
        ) : (
          <Icon width={100} height={70} />
        )}
        <Text style={styles.title}>
          {win === "true" ? "Congratulations" : "Thanks for playing today!"}
        </Text>

        <SignedOut>
          <Text style={styles.text}>Want to see your stats and streaks ?</Text>
          <Link href={"/login"} style={styles.btn} asChild>
            <TouchableOpacity>
              <Text style={styles.btnText}>Create a free account</Text>
            </TouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <Text style={styles.text}>Statistics</Text>
          <View style={styles.stats}>
            <View>
              <Text style={styles.score}>{userScore.played}</Text>
              <Text>Played</Text>
            </View>

            <View>
              <Text style={styles.score}>{userScore.wins}</Text>
              <Text>Wins</Text>
            </View>

            <View>
              <Text style={styles.score}>{userScore.currentStreak}</Text>
              <Text>Current Streak</Text>
            </View>
          </View>
        </SignedIn>

        <View
          style={{
            height: StyleSheet.hairlineWidth,
            width: "100%",
            backgroundColor: "#4e4e4e",
          }}
        />

        <TouchableOpacity onPress={shareGame} style={styles.iconBtn}>
          <Text style={styles.btnText}>Share your game</Text>
          <Ionicons name="share-social" size={24} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
    textAlign: "center",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    backgroundColor: "#000",
    borderWidth: 1,
    width: "100%",
    borderRadius: 30,
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  stats: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
    paddingVertical: 10,
  },
  score: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  iconBtn: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.green,
    borderRadius: 30,
    width: "70%",
  },
});
