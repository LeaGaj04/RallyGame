import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveStars = async (levelId: number, stars: number) => {
  try {
    const data = await AsyncStorage.getItem("progress");
    let progress = data ? JSON.parse(data) : {};

    if (!progress[levelId] || stars > progress[levelId]) {
      progress[levelId] = stars;
    }

    await AsyncStorage.setItem("progress", JSON.stringify(progress));
  } catch (e) {
    console.log(e);
  }
};

export const getProgress = async () => {
  try {
    const data = await AsyncStorage.getItem("progress");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};