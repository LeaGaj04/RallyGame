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

  /* 🚧 ENEMIGO AUTO */
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
    spawnPedestrian();
  }, []);

  /* 💥 COLISIONES */
  useEffect(() => {
    const listener = enemyY.addListener(({ value }) => {
      if (value > 350 && value < 450 && enemyLane === lane) {
        router.push("/result?success=false&stars=0");
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
        router.push("/result?success=false&stars=0");
      }
    });

    return () => {
      enemyY.removeListener(listener);
      pedX.removeListener(pedListener);
    };
  }, [lane, enemyLane, pedY]);

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
    </View>
  );
}

/* 🎨 ESTILOS */
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
});