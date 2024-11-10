import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '@/constants/Colors';
import { Stack, useRouter } from 'expo-router';
import OnScreenKeyboard from '@/components/OnScreenKeyboard';
import { Ionicons } from '@expo/vector-icons';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';

const ROWS = 6;

const Page = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;
  const router = useRouter();

  const [rows, setRows] = useState<String[][]>(new Array(ROWS).fill(new Array(5).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<String[]>([]);
  const [yellowLetters, setYellowLetters] = useState<String[]>([]);
  const [grayLetters, setGrayLetters] = useState<String[]>([]);

  // const [word, setWord] = useState<String>(words[Math.floor(Math.random() * words.length)]);
  const [word, setWord] = useState<String>("simon");
  const letters = word.split('');

  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  }

  const addKey = (key: String) => {
    console.log("addkey ", key)
    const newRows = [...rows.map((row) => [...row])];
    // const newRows = rows.copyWithin(0, 0)
    console.log(newRows);

    if (key === "ENTER") {
      // checkWord();
    }
    else if (key === "BACKSPACE") {

    }
    else if (colStateRef.current >= newRows[curRow].length){
      //We are at the end of a row, dont add a key
      return;
    }
    else{
      newRows[curRow][colStateRef.current] = key;
      setRows(newRows)
      setCurCol(colStateRef.current + 1);
    }


    const checkWord = () => {}
  }

  // console.log(rows)
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Stack.Screen options={{
        headerRight: () => (
          <View style={styles.headerIcon}>
            <Ionicons name='help-circle-outline' size={28} color={textColor}/>
            <Ionicons name='podium-outline' size={28} color={textColor}/>
            <Ionicons name='settings-sharp' size={28} color={textColor}/>
          </View>
        )
      }}/>
      <View style={styles.gameField}>
        {
          rows.map((row, rowIndex) => (
            <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
              {
                row.map((cell, cellIndex) => (
                  <View style={styles.cell} key={`cell-${cellIndex}`}>
                    <Text style={styles.cellText}>{cell}</Text>
                  </View>
                ))
              }
            </View>
          ))
        }
      </View>
      <OnScreenKeyboard onKeyPressed={addKey} greenLetters={greenLetters} yellowLetters={yellowLetters} grayLetters={grayLetters}/>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  }, 
  headerIcon: {
    flexDirection: 'row',
    gap: 10,
  },
  gameField: {
    alignItems: 'center',
    gap: 8
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 8,
  }, 
  cell: {
    width: 62,
    height: 62,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    
  }
})