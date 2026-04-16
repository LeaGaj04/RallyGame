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

  /* 🟣 HOVER BUTTON */
  const buttonScale = useRef(new Animated.Value(1)).current;

  const [isTransitioning, setIsTransitioning] = useState(false);

  /* ✨ PARTICULAS PRO */
  const particles = useRef(
    [...Array(40)].map(() => ({
      opacity: new Animated.Value(Math.random()),
      scale: new Animated.Value(Math.random() * 1 + 0.5),
      driftX: new Animated.Value(0),
      driftY: new Animated.Value(0),
      x: Math.random() * 350,
      y: Math.random() * 700,
      color: ["#FF00C8", "#00E5FF", "#A100FF"][Math.floor(Math.random() * 3)],
      size: Math.random() * 3 + 2,
    }))
  ).current;

  useEffect(() => {
    /* FADE */
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    /* GLOW */
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

    /* PARTICULAS */
    particles.forEach((p) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(p.opacity, {
            toValue: 0.1,
            duration: 800 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(p.opacity, {
            toValue: 1,
            duration: 800 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(p.scale, {
            toValue: 1.5,
            duration: 1200 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(p.scale, {
            toValue: 0.6,
            duration: 1200 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(p.driftX, {
            toValue: Math.random() * 20 - 10,
            duration: 2000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(p.driftX, {
            toValue: 0,
            duration: 2000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(p.driftY, {
            toValue: Math.random() * 20 - 10,
            duration: 2000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(p.driftY, {
            toValue: 0,
            duration: 2000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  /* 🚀 TRANSICIÓN */
  const handleStart = () => {
    if (isTransitioning) return;

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
      router.replace("/levels");
    });
  };

  /* 🟣 HOVER */
  const handleHoverIn = () => {
    Animated.spring(buttonScale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  /* 🔥 GLOW DINÁMICO */
  const glow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 25],
  });

  const glowHover = buttonScale.interpolate({
    inputRange: [1, 1.1],
    outputRange: [5, 25],
  });

  return (
    <View style={styles.container}>

      {/* PARTICULAS */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: 10,
            backgroundColor: p.color,
            left: p.x,
            top: p.y,
            opacity: p.opacity,
            transform: [
              { translateX: p.driftX },
              { translateY: p.driftY },
              { scale: p.scale },
            ],
            shadowColor: p.color,
            shadowRadius: 10,
            shadowOpacity: 1,
          }}
        />
      ))}

      {/* CONTENIDO */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        <Animated.Text
          style={[
            styles.title,
            { textShadowRadius: glow },
          ]}
        >
          NEON DRIVE
        </Animated.Text>

        <Text style={styles.subtitle}>ROAD SAFETY ACADEMY</Text>

        <Text style={styles.car}>🏎️</Text>

        <Text style={styles.description}>
          Learn road safety through{"\n"}neon-lit cyberpunk streets
        </Text>

        <View style={styles.separator} />

        {/* BOTÓN PRO */}
        <Animated.View
          style={{
            transform: [{ scale: buttonScale }],
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              isTransitioning && { opacity: 0.5 }
            ]}
            onPress={handleStart}
            onHoverIn={handleHoverIn}
            onHoverOut={handleHoverOut}
            disabled={isTransitioning}
            activeOpacity={0.8}
          >
            <Animated.Text
              style={[
                styles.buttonText,
                { textShadowRadius: glowHover }
              ]}
            >
              START GAME
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>

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

/* 🎨 */
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
    textShadowColor: "#FF00C8",
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