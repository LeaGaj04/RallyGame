import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LevelNode from "../components/LevelNode";
import { levels } from "./data/levels";

export default function Levels() {
    const router = useRouter();

    const currentLevel = 1;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mapa de Niveles</Text>
            <View style={styles.line} />

            <FlatList
                data={levels}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                renderItem={({ item }) => (
                    <LevelNode
                        level={item}
                        isCurrent={item.id === currentLevel}
                        onPress={() => router.push("/game")}
                    />
                )}
            />

            <Text style={styles.footer}>
                Nivel actual: {currentLevel} / {levels.length}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D0221",
        justifyContent: "center",
    },
    title: {
        color: "#fff",
        fontSize: 22,
        textAlign: "center",
        marginBottom: 20,
    },
    footer: {
        color: "#aaa",
        textAlign: "center",
        marginTop: 20,
    },
    line: {
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#444",
    },
});