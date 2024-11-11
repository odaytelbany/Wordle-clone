import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Ionicons } from "@expo/vector-icons";
import { allWords } from "@/utils/allWords";
import { words } from "@/utils/targetWords";

const ROWS = 6;

const Page = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  // const [word, setWord] = useState<string>(words[Math.floor(Math.random() * words.length)]);
  const [word, setWord] = useState<string>("simon");
  const wordLetters = word.split("");

  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  };

  const addKey = (key: string) => {
    console.log("addkey ", key);
    const newRows = [...rows.map((row) => [...row])];
    // const newRows = rows.copyWithin(0, 0)
    console.log(newRows);
    

    if (key === "ENTER") {
      checkWord();
    } else if (key === "BACKSPACE") {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = "";
        setRows(newRows);
        return;
      }
      newRows[curRow][colStateRef.current - 1] = "";
      setRows(newRows);
      setCurCol(colStateRef.current - 1);
      return;
    } else if (colStateRef.current >= newRows[curRow].length) {
      //We are at the end of a row, dont add a key
      return;
    } else {
      newRows[curRow][colStateRef.current] = key;
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join("");
    if (currentWord.length < word.length) {
      console.log("Must be 5 letters");
      // To show error
      return;
    }
    if (!allWords.includes(currentWord)) {
      console.log("Its not a word");
      // to show error
      return;
    }

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (currentWord === word){
        console.log("Word found!");
        //Show end game screen
      }else if (curRow + 1 >= rows.length){
        console.log("Game Over !");
        //Show end game screen
      }
    }, 1500)
    setCurRow(curRow + 1);
    setCurCol(0);
  };

  const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex) {
      if (wordLetters[cellIndex] === cell){
        return Colors.light.green;
      } 
      else if (wordLetters.includes(cell)){
        return Colors.light.yellow;
      }
      else{
        return Colors.light.gray
      }
    }
    return 'transparent';
  }

  const getBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      return getCellColor(cell, rowIndex, cellIndex);
    }
    return Colors.light.gray;
  }

  // console.log(rows)
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcon}>
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={textColor}
              />
              <Ionicons name="podium-outline" size={28} color={textColor} />
              <Ionicons name="settings-sharp" size={28} color={textColor} />
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <View style={[styles.cell, {backgroundColor: getCellColor(cell, rowIndex, cellIndex), borderColor: getBorderColor(cell, rowIndex, cellIndex)}]} key={`cell-${cellIndex}`}>
                <Text style={[styles.cellText, {color: curRow > rowIndex ? '#fff' : textColor}]}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <OnScreenKeyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  headerIcon: {
    flexDirection: "row",
    gap: 10,
  },
  gameField: {
    alignItems: "center",
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: "row",
    gap: 8,
  },
  cell: {
    width: 62,
    height: 62,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
