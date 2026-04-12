import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VIALY</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/game")}
      >
        <Text style={styles.text}>JUGAR</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/levels")}>
        <Text style={styles.link}>Mapa de niveles</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Text style={styles.link}>Mi perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0221",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#FF00C8",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#A100FF",
    padding: 20,
    borderRadius: 15,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
  link: {
    color: "#00E5FF",
    marginTop: 20,
  },
});