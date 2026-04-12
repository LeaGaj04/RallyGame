import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Result() {
  const { success } = useLocalSearchParams();
  const router = useRouter();

  const isSuccess = success === "true";

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>
        {isSuccess ? "✅ Correcto" : "❌ Incorrecto"}
      </Text>

      {!isSuccess && (
        <Text>Siempre debes detenerte completamente en una señal PARE.</Text>
      )}

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}