import React, { useState, useEffect, useContext, useCallback } from "react";
import { Platform, Text, View, StyleSheet, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import axios from "axios";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [disabled, setDisabled] = useState(true);
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [locList, setLocList] = useState([]);

  const _handleDetailAddressChange = (address) => {
    setDetailAddress(address);
  };

  const mApiKey = "AIzaSyBCIAtcRlEpIlXq1Rv9xYlsXz_Xav5mq0I";

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(Number(location.coords.latitude));
      setLongitude(Number(location.coords.longitude));
      console.log(longitude, latitude);

      await axios
        .get(
          "https://dapi.kakao.com/v2/local/search/keyword?query=즉석사진" +
            "&x=" +
            longitude +
            "&y=" +
            latitude +
            "&radius=5000",
          {
            headers: {
              Authorization: "KakaoAK 593cba0bc3ea7f52024615b72630d3ee",
            },
          }
        )
        .then((res) => {
          const result = res.data.documents;
          const list = [];
          for (let i = 0; i < result.length; i++) {
            list.push({
              id: i,
              lat: result[i].y,
              lng: result[i].x,
              name: result[i].place_name,
            });
          }
          setLocList(list);
          console.log(list);
        })
        .catch((err) => {
          Alert.alert(err);
        });
    })();
  }, [longitude, latitude]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  // const mark = (locList) => {
  //   for (let i = 0; i < locList.length; i++) {
  //     <Marker
  //       pinColor="#1E90FF"
  //       coordinate={{ latitude: locList[i].lat, longitude: locList[i].lng }}
  //     />;
  //   }
  // };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.005, //위도 확대(1에 가까워질 수록 zoom out)
          longitudeDelta: 0.001, //경도 확대
        }}
      >
        {locList.map((marker) => {
          return (
            <Marker
              key={marker.id}
              pinColor="#1E90FF"
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
              title={marker.name}
              description={marker.name + "입니다"}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    flex: 1,
    top: 20,
    width: "100%",
    height: "100%",
  },
});
