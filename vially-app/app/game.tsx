import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  PanResponder
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";

const question = {
  text: "Te aproximas a una señal PARE. ¿Qué haces?",
  options: [
    "Disminuir y seguir",
    "Detenerte completamente",
    "Acelerar"
  ],
  correct: 1,
};

export default function Game() {
  const router = useRouter();

  /* ⏱ TIMER */
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time === 0) {
      handleFail();
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  /* 🛣️ CARRETERA */
  const roadAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(roadAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = roadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  /* 🚗 AUTO */
  const carX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newX = gesture.dx;
        if (newX > 120) newX = 120;
        if (newX < -120) newX = -120;
        carX.setValue(newX);
      },
    })
  ).current;

  /* 🚨 EFECTO FALLO */
  const flash = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  const triggerFailAnimation = () => {
    // 🔴 Flash rojo
    Animated.sequence([
      Animated.timing(flash, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flash, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 💥 Shake pantalla
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  /* ⭐ SISTEMA DE ESTRELLAS */
  const calculateStars = () => {
    if (time >= 7) return 3;
    if (time >= 4) return 2;
    return 1;
  };

  /* ❌ FALLO */
  const handleFail = () => {
    triggerFailAnimation();

    setTimeout(() => {
      router.push("/result?success=false&stars=0");
    }, 500);
  };

  /* ✅ RESPUESTA */
  const handleAnswer = (index: number) => {
    if (index === question.correct) {
      const stars = calculateStars();
      router.push(`/result?success=true&stars=${stars}`);
    } else {
      handleFail();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: shake }] }
      ]}
    >

      {/* 🌆 FONDO */}
      <View style={styles.background} />

      {/* 🛣️ CARRETERA */}
      <Animated.View style={[styles.road, { transform: [{ translateY }] }]}>
        <View style={styles.laneContainer}>
          {[...Array(10)].map((_, i) => (
            <View key={i} style={styles.laneLine} />
          ))}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.road,
          { transform: [{ translateY: Animated.add(translateY, -200) }] }
        ]}
      >
        <View style={styles.laneContainer}>
          {[...Array(10)].map((_, i) => (
            <View key={i} style={styles.laneLine} />
          ))}
        </View>
      </Animated.View>

      {/* 🚨 FLASH ROJO */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: "red",
            opacity: flash,
          },
        ]}
      />

      {/* 📊 HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>🚗 40 km/h</Text>
        <Text style={styles.hudText}>⚡ 150 XP</Text>
        <Text style={styles.hudText}>⚠️ 5 multas</Text>
      </View>

      {/* 🚗 AUTO */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.car,
          { transform: [{ translateX: carX }] }
        ]}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>🚘</Text>
      </Animated.View>

      {/* ⏱ TIMER */}
      <View style={styles.timerContainer}>
        <View style={[styles.timerBar, { width: `${time * 10}%` }]} />
        <Text style={styles.timerText}>{time}s</Text>
      </View>

      {/* ❓ PREGUNTA */}
      <View style={styles.questionBox}>
        <Text style={styles.question}>{question.text}</Text>

        {question.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={styles.option}
            onPress={() => handleAnswer(i)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0221",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#140033",
  },

  road: {
    position: "absolute",
    width: "100%",
    height: 400,
    bottom: 0,
    backgroundColor: "#140033",
    borderTopWidth: 2,
    borderTopColor: "#FF00C8",
  },

  laneContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
  },

  laneLine: {
    width: 6,
    height: 40,
    backgroundColor: "#FFD700",
    marginVertical: 10,
    borderRadius: 3,
  },

  hud: {
    position: "absolute",
    top: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  hudText: {
    color: "#00E5FF",
    fontWeight: "bold",
  },

  car: {
    position: "absolute",
    bottom: 220,
    alignSelf: "center",
    backgroundColor: "#A100FF",
    padding: 12,
    borderRadius: 12,
  },

  timerContainer: {
    position: "absolute",
    bottom: 160,
    width: "90%",
    alignSelf: "center",
    height: 20,
    backgroundColor: "#222",
    borderRadius: 10,
    overflow: "hidden",
  },

  timerBar: {
    height: "100%",
    backgroundColor: "#00E5FF",
  },

  timerText: {
    position: "absolute",
    alignSelf: "center",
    color: "#fff",
  },

  questionBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1F1147",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  question: {
    color: "#fff",
    marginBottom: 15,
  },

  option: {
    backgroundColor: "#A100FF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  optionText: {
    color: "#fff",
  },
});