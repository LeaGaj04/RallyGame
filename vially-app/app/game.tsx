import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";

const LANES = [-100, 0, 100];

export default function Game() {
  const router = useRouter();

  /* 🎮 GAME STATE */
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [speed, setSpeed] = useState(60);

  /* ⏱ TIMER */
  const [time, setTime] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t - 1);
      setScore((s) => s + 10);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* 🚗 AUTO */
  const [lane, setLane] = useState(1);
  const carX = useRef(new Animated.Value(LANES[1])).current;

  const moveLane = (dir: number) => {
    let newLane = lane + dir;
    if (newLane < 0) newLane = 0;
    if (newLane > 2) newLane = 2;

    setLane(newLane);

    Animated.spring(carX, {
      toValue: LANES[newLane],
      useNativeDriver: true,
    }).start();
  };

  /* 🚧 ENEMIGO */
  const enemyY = useRef(new Animated.Value(-200)).current;
  const [enemyLane, setEnemyLane] = useState(1);

  const spawnEnemy = () => {
    const randomLane = Math.floor(Math.random() * 3);
    setEnemyLane(randomLane);

    enemyY.setValue(-200);

    Animated.timing(enemyY, {
      toValue: 600,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spawnEnemy());
  };

  useEffect(() => {
    spawnEnemy();
  }, []);

  /* 💥 COLISIÓN */
  useEffect(() => {
    const listener = enemyY.addListener(({ value }) => {
      if (value > 350 && value < 450) {
        if (enemyLane === lane) {
          setHp((prev) => prev - 20);

          if (hp <= 20) {
            router.push("/result?success=false&stars=0");
          }
        }
      }
    });

    return () => enemyY.removeListener(listener);
  }, [lane, enemyLane, hp]);

  /* 🛣️ CARRETERA */
  const roadAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(roadAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = roadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <View style={styles.container}>

      {/* 🛣️ CARRETERA */}
      <Animated.View style={[styles.road, { transform: [{ translateY }] }]} />
      <Animated.View
        style={[
          styles.road,
          { transform: [{ translateY: Animated.add(translateY, -300) }] }
        ]}
      />

      {/* LÍNEAS */}
      <View style={styles.lanes}>
        <View style={styles.line} />
        <View style={styles.line} />
      </View>

      {/* 🚧 ENEMIGO */}
      <Animated.View
        style={[
          styles.enemy,
          {
            transform: [
              { translateY: enemyY },
              { translateX: LANES[enemyLane] }
            ],
          },
        ]}
      >
        <Text style={{ fontSize: 20 }}>🚙</Text>
      </Animated.View>

      {/* 🚗 AUTO */}
      <Animated.View
        style={[
          styles.car,
          { transform: [{ translateX: carX }] }
        ]}
      >
        <Text style={{ fontSize: 22 }}>🚗</Text>
      </Animated.View>

      {/* 🎮 UI NEON SUPERIOR */}
      <View style={styles.topUI}>

        {/* PAUSE */}
        <View style={styles.neonBoxPink}>
          <Text style={styles.neonTextPink}>⏸ PAUSE</Text>
        </View>

        {/* SCORE */}
        <Text style={styles.score}>{score}</Text>

      </View>

      {/* ❤️ HP BAR */}
      <View style={styles.hpContainer}>
        <View style={[styles.hpBar, { width: `${hp}%` }]} />
      </View>

      {/* 🎮 CONTROLES */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={() => moveLane(-1)}>
          <Text style={styles.btnText}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => moveLane(1)}>
          <Text style={styles.btnText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* 🟣 SPEED */}
      <View style={styles.speedCircle}>
        <Text style={styles.speedText}>{speed}</Text>
        <Text style={{ color: "#FF00C8" }}>KM/H</Text>
      </View>

      {/* 🛑 BRAKE */}
      <TouchableOpacity style={styles.brake}>
        <Text style={styles.brakeText}>BRAKE</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 ESTILOS NEON */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0221",
    alignItems: "center",
  },

  road: {
    position: "absolute",
    width: 250,
    height: 300,
    backgroundColor: "#1F1147",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#FF00C8",
  },

  lanes: {
    position: "absolute",
    width: 250,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  line: {
    width: 4,
    height: 100,
    backgroundColor: "#fff",
    opacity: 0.3,
  },

  car: {
    position: "absolute",
    bottom: 200,
  },

  enemy: {
    position: "absolute",
  },

  /* UI */
  topUI: {
    position: "absolute",
    top: 60,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  neonBoxPink: {
    borderWidth: 2,
    borderColor: "#FF00C8",
    padding: 8,
  },

  neonTextPink: {
    color: "#FF00C8",
    fontWeight: "bold",
  },

  score: {
    color: "#FFD700",
    fontSize: 18,
  },

  hpContainer: {
    position: "absolute",
    top: 100,
    width: "80%",
    height: 6,
    backgroundColor: "#222",
  },

  hpBar: {
    height: "100%",
    backgroundColor: "#00FF00",
  },

  controls: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    gap: 20,
  },

  btn: {
    backgroundColor: "#A100FF",
    padding: 20,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
  },

  speedCircle: {
    position: "absolute",
    right: 20,
    bottom: 180,
    borderWidth: 2,
    borderColor: "#FF00C8",
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
  },

  speedText: {
    color: "#fff",
    fontSize: 18,
  },

  brake: {
    position: "absolute",
    right: 20,
    bottom: 100,
    borderWidth: 2,
    borderColor: "#FF00C8",
    padding: 10,
  },

  brakeText: {
    color: "#FF00C8",
  },
});