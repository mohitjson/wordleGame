import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Alert } from "react-native";
import axios from "axios";
import { colors, ENTER } from "./src/constants";
import Keyboard from "./src/components/Keyboard";

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

const words = ["ALBUM", "HINGE", "MONEY", "SCRAP", "GAMER", "GLASS"];

export default function App() {
  useEffect(() => {
    apiCall();
  },[]);
  const [list, setList] = useState();

  //Api calling
  function apiCall() {
    const BASE_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

    axios.get(BASE_URL).then((response) => setList(response.data));
  }
  const word = words[0].toLowerCase();

  const letters = word.split(""); // ['h', 'e', 'l', 'l', 'o']

  function arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }
  const compareRowWithData = (row) => {
    let flag = false;
    words.forEach((item) => {
      const word = item.toLowerCase();
      const letterInd = word.split("");
      if (arrayEquals(letterInd, row)) {
        flag = true;
      }
    });
    return flag;
  };

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(5).fill(""))
  );

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("playing"); // won, lost, playing

  useEffect(() => {
    // apiCall();
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== "won") {
      Alert.alert("Huraaay", "You won!", [{ text: "Play Again" }]);
      setGameState("won");
    } else if (checkIfLost() && gameState !== "lost") {
      Alert.alert("Lose!", "Better Luck Next Time!", [{ text: "Play Again" }]);
      setGameState("lost");
    }
  };

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    // return row.every((letter, i) => letter === letters[i]);
    console.log(compareRowWithData(row));
    return compareRowWithData(row);
  };

  const checkIfLost = () => {
    return !checkIfWon() && curRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    console.log(letter);

    if (row >= curRow) {
      return "white";
    }
    //TODO:send all letter
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j) ? "red" : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Keyboard onKeyPressed={onKeyPressed} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
  },

  map: {
    alignSelf: "stretch",
    marginVertical: 20,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 28,
  },
});
