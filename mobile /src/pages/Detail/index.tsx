import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MailComposer from "expo-mail-composer";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import api from "../../services/api";
import { styles } from "./styles";

interface Params {
  point_id: number;
}

interface Data {
  point: {
    name: string;
    email: string;
    image: string;
    image_url: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

export default function Detail() {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;
  const { point_id } = routeParams;
  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    api
      .get(`points/${point_id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
  }, []);

  if (!data.point) {
    return null;
  }

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse na coleta dos resíduos`
    );
  };

  const composeMail = () => {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de resíduos",
      recipients: [data.point.email],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="arrow-left" size={24} color="#34CB79" />
        </TouchableOpacity>
        <Image
          style={styles.pointImage}
          source={{
            uri: data.point.image_url,
          }}
        />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map((item) => item.title).join(", ")}
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton
          style={styles.button}
          onPress={() => {
            handleWhatsapp();
          }}
        >
          <FontAwesome name="whatsapp" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton
          style={styles.button}
          onPress={() => {
            composeMail();
          }}
        >
          <Icon name="mail" size={24} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}
