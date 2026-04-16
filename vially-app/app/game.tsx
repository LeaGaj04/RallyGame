import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

const LANES = [-100, 0, 100];

export default function Game() {
  const router = useRouter();
  const { level } = useLocalSearchParams();
  const levelId = Number(level ?? 1);

  /* ⏱ TIMER */
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time <= 0) {
      handleFail();
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  /* ⭐ CALCULO */
  const calculateStars = () => {
    if (time >= 7) return 3;
    if (time >= 4) return 2;
    return 1;
  };

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

  /* 🚧 AUTO ENEMIGO */
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

  /* 🚶 PEATÓN */
  const pedX = useRef(new Animated.Value(-150)).current;
  const [pedY, setPedY] = useState(200);

  const spawnPedestrian = () => {
    const randomY = Math.random() * 300 + 100;
    setPedY(randomY);

    pedX.setValue(-150);

    Animated.timing(pedX, {
      toValue: 150,
      duration: 2500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spawnPedestrian());
  };

  useEffect(() => {
    spawnEnemy();
    spawnPedestrian();
  }, []);

  /* 💥 COLISIONES */
  useEffect(() => {
    const enemyListener = enemyY.addListener(({ value }) => {
      if (value > 350 && value < 450 && enemyLane === lane) {
        handleFail();
      }
    });

    const pedListener = pedX.addListener(({ value }) => {
      const playerX = LANES[lane];

      if (
        value > playerX - 40 &&
        value < playerX + 40 &&
        pedY > 350 &&
        pedY < 450
      ) {
        handleFail();
      }
    });

    return () => {
      enemyY.removeListener(enemyListener);
      pedX.removeListener(pedListener);
    };
  }, [lane, enemyLane, pedY]);

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

  /* ✅ WIN */
  const handleWin = () => {
    const stars = calculateStars();

    router.push({
      pathname: "/result",
      params: {
        success: "true",
        stars: String(stars),
        level: String(levelId),
      },
    });
  };

  /* ❌ FAIL */
  const handleFail = () => {
    router.push({
      pathname: "/result",
      params: {
        success: "false",
        stars: "0",
        level: String(levelId),
      },
    });
  };

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

      {/* 🚧 AUTO ENEMIGO */}
      <Animated.View
        style={{
          position: "absolute",
          transform: [
            { translateY: enemyY },
            { translateX: LANES[enemyLane] }
          ],
        }}
      >
        <Text style={{ fontSize: 20 }}>🚙</Text>
      </Animated.View>

      {/* 🚶 PEATÓN */}
      <Animated.View
        style={{
          position: "absolute",
          top: pedY,
          transform: [{ translateX: pedX }],
        }}
      >
        <Text style={{ fontSize: 18 }}>🚶</Text>
      </Animated.View>

      {/* 🚗 JUGADOR */}
      <Animated.View
        style={[
          styles.car,
          { transform: [{ translateX: carX }] }
        ]}
      >
        <Text style={{ fontSize: 22 }}>🚗</Text>
      </Animated.View>

      {/* 🎮 CONTROLES */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={() => moveLane(-1)}>
          <Text style={styles.btnText}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => moveLane(1)}>
          <Text style={styles.btnText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* DEBUG BOTÓN GANAR */}
      <TouchableOpacity style={styles.winBtn} onPress={handleWin}>
        <Text style={{ color: "#fff" }}>WIN</Text>
      </TouchableOpacity>

    </View>
  );
}

/* 🎨 */
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

  winBtn: {
    position: "absolute",
    top: 50,
    backgroundColor: "green",
    padding: 10,
  },
});