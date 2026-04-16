import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getProgress } from "../utils/storage";

const levels = [
    { id: 1, name: "First Drive", icon: "🚶", color: "#FF00C8" },
    { id: 2, name: "Red Means Stop", icon: "🚦", color: "#FFD700" },
    { id: 3, name: "City Traffic", icon: "🚗", color: "#00E5FF" },
    { id: 4, name: "Crosswalk Chaos", icon: "🚶", color: "#FF00C8" },
    { id: 5, name: "Rush Hour", icon: "🚗", color: "#00E5FF" },
    { id: 6, name: "Night Drive", icon: "🌙", color: "#A100FF" },
];

export default function Levels() {
    const router = useRouter();
    const [progress, setProgress] = useState<Record<number, number>>({});

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const data = await getProgress();
        setProgress(data);
    };

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>NEON DRIVE</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.boxPink}>
                        <Text style={styles.label}>SCORE</Text>
                        <Text style={styles.value}>---</Text>
                    </View>

                    <View style={styles.boxBlue}>
                        <Text style={styles.label}>STARS</Text>
                        <Text style={styles.value}>---</Text>
                    </View>
                </View>
            </View>

            {/* MAPA */}
            <ScrollView contentContainerStyle={styles.map}>
                <View style={styles.line} />

                {levels.map((lvl) => {
                    const stars = progress[lvl.id] ?? 0;

                    const prevStars = progress[lvl.id - 1] ?? 0;

                    const isUnlocked = lvl.id === 1 || prevStars >= 2;

                    return (
                        <TouchableOpacity
                            key={lvl.id}
                            style={styles.nodeContainer}
                            disabled={!isUnlocked}
                            onPress={() => router.push(`/game?level=${lvl.id}`)}
                        >
                            <View
                                style={[
                                    styles.node,
                                    {
                                        borderColor: isUnlocked ? lvl.color : "#444",
                                        opacity: isUnlocked ? 1 : 0.3,
                                    },
                                ]}
                            >
                                <Text style={styles.icon}>
                                    {isUnlocked ? lvl.icon : "🔒"}
                                </Text>
                            </View>

                            <View style={styles.stars}>
                                {[1, 2, 3].map((i) => (
                                    <Text
                                        key={i}
                                        style={{
                                            color: i <= stars ? "#FFD700" : "#444",
                                        }}
                                    >
                                        ⭐
                                    </Text>
                                ))}
                            </View>

                            <Text style={styles.levelName}>{lvl.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

/* 🎨 */
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
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
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