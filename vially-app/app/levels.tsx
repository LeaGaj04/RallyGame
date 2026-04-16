import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";

const levels = [
  { id: 1, name: "First Drive", icon: "🚶", stars: 3, color: "#FF00C8" },
  { id: 2, name: "Red Means Stop", icon: "🚦", stars: 3, color: "#FFD700" },
  { id: 3, name: "City Traffic", icon: "🚗", stars: 3, color: "#00E5FF" },
  { id: 4, name: "Crosswalk Chaos", icon: "🚶", stars: 3, color: "#FF00C8" },
  { id: 5, name: "Rush Hour", icon: "🚗", stars: 2, color: "#00E5FF" },
  { id: 6, name: "Night Drive", icon: "🌙", stars: 0, color: "#A100FF" },
];

export default function Levels() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>NEON DRIVE</Text>

        <View style={styles.statsContainer}>
          <View style={styles.boxPink}>
            <Text style={styles.label}>SCORE</Text>
            <Text style={styles.value}>4750</Text>
          </View>

          <View style={styles.boxBlue}>
            <Text style={styles.label}>STARS</Text>
            <Text style={styles.value}>15/30</Text>
          </View>
        </View>
      </View>

      {/* 🗺️ MAPA */}
      <ScrollView contentContainerStyle={styles.map}>

        {/* Línea vertical */}
        <View style={styles.line} />

        {levels.map((lvl, index) => (
          <TouchableOpacity
            key={lvl.id}
            style={styles.nodeContainer}
            onPress={() => router.push("/game")}
          >
            {/* Nodo */}
            <View
              style={[
                styles.node,
                {
                  borderColor: lvl.color,
                  shadowColor: lvl.color,
                },
              ]}
            >
              <Text style={styles.icon}>{lvl.icon}</Text>
            </View>

            {/* Estrellas */}
            <View style={styles.stars}>
              {[1, 2, 3].map((i) => (
                <Text key={i} style={{ color: i <= lvl.stars ? "#FFD700" : "#444" }}>
                  ⭐
                </Text>
              ))}
            </View>

            {/* Nombre */}
            <Text style={styles.levelName}>{lvl.name}</Text>

          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050010",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    color: "#FF00C8",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  boxPink: {
    borderWidth: 2,
    borderColor: "#FF00C8",
    padding: 15,
    width: "48%",
  },

  boxBlue: {
    borderWidth: 2,
    borderColor: "#00E5FF",
    padding: 15,
    width: "48%",
  },

  label: {
    color: "#aaa",
    fontSize: 12,
  },

  value: {
    color: "#fff",
    fontSize: 18,
  },

  map: {
    alignItems: "center",
    paddingVertical: 40,
  },

  line: {
    position: "absolute",
    width: 2,
    height: "100%",
    backgroundColor: "#FF00C8",
    opacity: 0.3,
  },

  nodeContainer: {
    alignItems: "center",
    marginVertical: 30,
  },

  node: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 1,
    shadowRadius: 15,
  },

  icon: {
    fontSize: 28,
  },

  stars: {
    flexDirection: "row",
    marginTop: 5,
  },

  levelName: {
    color: "#fff",
    marginTop: 5,
  },
});