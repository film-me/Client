import React, { useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionic from "react-native-vector-icons/Ionicons";
import { UserContext } from "../contexts/User";
import axios from "axios";

export default function UploadPose({ navigation }) {
  //이미지 업로드 여부
  const [upload, setupload] = useState(false);

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const devHeight = Dimensions.get("window").height;

  //업로드 이미지@
  const [image, setImage] = useState(null);
  const { user, dispatch } = useContext(UserContext);

  //이미지 가져오는 함수
  const pickImage = async () => {
    setupload(true);
    setModalVisible(!modalVisible);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    } else if (result.cancelled) {
      setupload(false);
    }
  };

  //이미지 삭제 함수
  const delete_image = async () => {
    setImage(null);
    setupload(false);
  };

  //업로드 버튼
  const pressUploadBtn = useCallback(async () => {
    if (!image) {
      Alert.alert("이미지를 포함하여 업로드해주세요.");
      return;
    }
    const form = new FormData();
    const filename = image.split("/").pop();

    form.append("image", {
      uri: image,
      name: filename,
      type: "multipart/form-data",
    });
    console.log("ㅎㅇ");
    console.log(form);
    console.log(image);
    axios
      .post("http://13.125.249.247/filme/poseGallery", form, {
        headers: {
          "x-access-token": `${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        dispatch({
          userIdx: user.userIdx,
          identification: user.identification,
          token: user.token,
        });
        Alert.alert("업로드 되었습니다.");
        navigation.navigate("Pose");
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("포즈 업로드 중 에러 발생");
        navigation.navigate("Pose");
      });
  }, [image, user, dispatch]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.photoSection}>
        <View style={styles.photoBox}>
          {upload ? null : (
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign
                name="camerao"
                style={{ fontSize: 30, color: "#505050" }}
              />
            </TouchableOpacity>
          )}
          {image && (
            <ImageBackground
              source={{ uri: image }}
              style={{ width: 330, height: 400, borderRadius: 10 }}
            >
              {upload ? (
                <TouchableOpacity onPress={delete_image}>
                  <AntDesign
                    name="minuscircle"
                    style={{
                      textAlign: "right",
                      fontSize: 25,
                      color: "rgba(90,90,90,0.8)",
                      padding: 5,
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </ImageBackground>
          )}
        </View>
      </View>

      <View style={styles.ButtonSection}>
        <TouchableOpacity style={styles.ButtonBox} onPress={pressUploadBtn}>
          <Text style={{ fontSize: 15, color: "#505050" }}>업로드</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000AA",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              paddingHorizontal: 10,
              maxHeight: devHeight * 0.4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 10,
                marginVertical: 10,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: "#505050" }}
              >
                포즈 업로드하기
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Ionic
                  name="close"
                  style={{ fontSize: 20, color: "#505050", textAlign: "right" }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginHorizontal: 10,
                marginVertical: 20,
              }}
            >
              <TouchableOpacity onPress={pickImage}>
                <AntDesign
                  name="picture"
                  style={{ fontSize: 65, color: "#505050" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#505050",
                  }}
                >
                  갤러리
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate("SelectPhotoStory");
                }}
              >
                <Image
                  source={require("../../assets/icon.png")}
                  style={{ width: 55, height: 55, margin: 5 }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#505050",
                  }}
                >
                  스토리
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  photoSection: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  photoBox: {
    width: 350,
    height: 420,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  memoSection: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  memoBox: {
    width: 350,
    height: 80,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
  },
  dateSection: {
    margin: 10,
  },
  dateBox: {
    margin: 5,
    marginLeft: 17,
    flexDirection: "row",
  },
  ButtonSection: {
    marginBottom: 10,
    marginRight: 15,
    alignSelf: "flex-end",
  },
  ButtonBox: {
    width: 75,
    height: 35,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
