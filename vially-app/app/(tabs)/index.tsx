import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* 🌆 FONDO GRID */}
      <View style={styles.grid} />

      {/* 🟣 CONTENIDO */}
      <View style={styles.content}>

        {/* 🔥 TÍTULO */}
        <Text style={styles.title}>NEON DRIVE</Text>
        <Text style={styles.subtitle}>ROAD SAFETY ACADEMY</Text>

        {/* 🚗 AUTO */}
        <Text style={styles.car}>🏎️</Text>

        {/* 📝 DESCRIPCIÓN */}
        <Text style={styles.description}>
          Learn road safety through{"\n"}neon-lit cyberpunk streets
        </Text>

        {/* ➖ SEPARADOR */}
        <View style={styles.separator} />

        {/* ▶️ BOTÓN */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/levels")}
        >
          <Text style={styles.buttonText}>START GAME</Text>
        </TouchableOpacity>

        {/* 📌 FEATURES */}
        <Text style={styles.features}>
          Pedestrians   |   Signals   |   Traffic
        </Text>

        {/* 🧾 VERSION */}
        <Text style={styles.version}>
          V1.0 // CYBERPUNK EDITION
        </Text>

      </View>
    </View>
  );
}

/* 🎨 ESTILOS NEON */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050010",
    justifyContent: "center",
    alignItems: "center",
  },

  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    backgroundColor: "#0D0221",
  },

  content: {
    alignItems: "center",
  },

  title: {
    fontSize: 36,
    color: "#FF00C8",
    fontWeight: "bold",
    textShadowColor: "#FF00C8",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  subtitle: {
    color: "#00E5FF",
    marginBottom: 30,
    textShadowColor: "#00E5FF",
    textShadowRadius: 10,
  },

  car: {
    fontSize: 40,
    marginBottom: 20,
  },

  description: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },

  separator: {
    width: 80,
    height: 1,
    backgroundColor: "#FF00C8",
    marginVertical: 15,
  },

  button: {
    borderWidth: 2,
    borderColor: "#FF00C8",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    shadowColor: "#FF00C8",
    shadowOpacity: 1,
    shadowRadius: 15,
  },

  buttonText: {
    color: "#FF00C8",
    fontWeight: "bold",
    letterSpacing: 2,
  },

  features: {
    color: "#aaa",
    marginTop: 30,
    fontSize: 12,
  },

  version: {
    color: "#444",
    marginTop: 10,
    fontSize: 10,
  },
});