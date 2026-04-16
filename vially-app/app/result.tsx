import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { saveStars } from "../utils/storage";

export default function Result() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const isSuccess = params.success === "true";
  const starCount = Number(params.stars ?? 0);
  const level = Number(params.level ?? 1);

  useEffect(() => {
    if (isSuccess) {
      saveStars(level, starCount);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSuccess ? "LEVEL CLEAR!" : "FAILED"}
      </Text>

      <Text style={styles.stars}>
        {"⭐".repeat(starCount)}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/levels")}
      >
        <Text style={styles.btnText}>CONTINUE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace(`/game?level=${level}`)}
      >
        <Text style={styles.replay}>REPLAY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050010",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  stars: {
    fontSize: 30,
    marginBottom: 20,
  },
  btn: {
    borderWidth: 2,
    borderColor: "#00E5FF",
    padding: 15,
    marginBottom: 10,
  },
  btnText: {
    color: "#00E5FF",
  },
  replay: {
    color: "#aaa",
  },
});