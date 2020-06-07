import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { styles } from "./styles";
export default function Points() {
  const navigation = useNavigation();
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              consciente
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o estado"
            value={uf}
            onChangeText={(text) => setUf(text)}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite a cidade"
            autoCorrect={false}
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <RectButton
            style={styles.button}
            onPress={() => {
              navigation.navigate("Points", { city, uf });
            }}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" size={24} color="#fff" />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
