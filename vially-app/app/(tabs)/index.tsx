import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();

  /* 🔥 ANIMACIONES */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /* ✨ PARTICULAS */
  const particles = useRef(
    [...Array(20)].map(() => new Animated.Value(0))
  ).current;

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Partículas
    particles.forEach((anim, i) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000 + i * 200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  /* 🚀 TRANSICIÓN */
  const handleStart = () => {
    setIsTransitioning(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push("/levels");
    });
  };

  const glow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 25],
  });

  return (
    <View style={styles.container}>

      {/* ✨ PARTICULAS */}
      {particles.map((anim, i) => {
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -600],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: Math.random() * 300,
                transform: [{ translateY }],
              },
            ]}
          />
        );
      })}

      {/* CONTENIDO */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        {/* 🔥 LOGO */}
        <Animated.Text
          style={[
            styles.title,
            {
              textShadowRadius: glow,
            },
          ]}
        >
          NEON DRIVE
        </Animated.Text>

        <Text style={styles.subtitle}>ROAD SAFETY ACADEMY</Text>

        {/* 🚗 */}
        <Text style={styles.car}>🏎️</Text>

        {/* 📝 */}
        <Text style={styles.description}>
          Learn road safety through{"\n"}neon-lit cyberpunk streets
        </Text>

        <View style={styles.separator} />

        {/* ▶️ BOTÓN */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>START GAME</Text>
        </TouchableOpacity>

        <Text style={styles.features}>
          Pedestrians   |   Signals   |   Traffic
        </Text>

        <Text style={styles.version}>
          V1.0 // CYBERPUNK EDITION
        </Text>
      </Animated.View>
    </View>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050010",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  title: {
    fontSize: 36,
    color: "#FF00C8",
    fontWeight: "bold",
    textShadowColor: "#FF00C8",
  },

  subtitle: {
    color: "#00E5FF",
    marginBottom: 30,
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

  /* ✨ PARTICULAS */
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "#FF00C8",
    borderRadius: 2,
    bottom: 0,
    opacity: 0.6,
  },
});