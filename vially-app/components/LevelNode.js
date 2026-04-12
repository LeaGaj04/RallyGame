import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LevelNode({ level, isCurrent, onPress }) {
  return (
    <TouchableOpacity
      onPress={level.unlocked ? onPress : null}
      style={styles.container}
    >
      <View
        style={[
          styles.circle,
          level.unlocked ? styles.unlocked : styles.locked,
          isCurrent && styles.current
        ]}
      >
        <Text style={styles.number}>{level.id}</Text>
      </View>

      <Text style={styles.title}>{level.title}</Text>
      <Text style={styles.subtitle}>{level.subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  unlocked: {
    backgroundColor: "#A100FF",
  },
  locked: {
    backgroundColor: "#2A1B4D",
  },
  current: {
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  number: {
    color: "#fff",
    fontSize: 20,
  },
  title: {
    color: "#fff",
    marginTop: 5,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 10,
  },
});