import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionic from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { UserContext } from "../contexts/User";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const devWidth = Dimensions.get("window").width;
const devHeight = Dimensions.get("window").height;

const Item = React.memo(({ item: { id, img, memberIdx } }) => {
  //modal
  const [modalVisible, setModalVisible] = useState(false); //본인
  const [others_modalVisible, setOthers_ModalVisible] = useState(false); //상대방

  const { user, dispatch } = useContext(UserContext);

  const navigation = useNavigation();

  const popup = () => {
    if (user.userIdx == memberIdx) {
      setModalVisible(!modalVisible);
    } else {
      setOthers_ModalVisible(!others_modalVisible);
    }
  };

  const _handleDeletePress = useCallback(() => {
    let isMount = true;
    try {
      axios({
        method: "patch",
        url: "http://13.125.249.247/filme/pose/" + id,
        headers: {
          "x-access-token": `${user?.token}`,
        },
      })
        .then(function (response) {
          if (isMount) {
            console.log(response.data);
            dispatch({
              userIdx: user.userIdx,
              identification: user.identification,
              token: user.token,
            });
            setModalVisible(!modalVisible);

            Alert.alert("삭제", "완료되었습니다.");
            return response.data;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
      alert("Error", e);
    } finally {
      return () => {
        isMount = false;
        setModalVisible(false);
      };
    }
  }, [user, dispatch]);

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <TouchableOpacity
        style={{ margin: 1 }}
        onPress={() =>
          navigation.navigate("Detail_Pose", {
            idx: id,
            memberIdx: memberIdx,
          })
        }
        onLongPress={popup}
      >
        <Image source={{ uri: img }} style={styles.img} />
      </TouchableOpacity>
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
                나의 포즈
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
              <TouchableOpacity onPress={_handleDeletePress}>
                <Feather
                  name="trash-2"
                  style={{ fontSize: 60, color: "#505050" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#505050",
                  }}
                >
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={others_modalVisible}
        onRequestClose={() => {
          setOthers_ModalVisible(!others_modalVisible);
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
                다른 사용자의 포즈
              </Text>
              <TouchableOpacity
                onPress={() => setOthers_ModalVisible(!others_modalVisible)}
              >
                <Ionic
                  name="close"
                  style={{
                    fontSize: 20,
                    color: "#505050",
                    textAlign: "right",
                  }}
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
              <TouchableOpacity>
                <AntDesign
                  name="sharealt"
                  style={{ fontSize: 65, color: "#505050" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#505050",
                  }}
                >
                  공유
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign
                  name="link"
                  style={{ fontSize: 65, color: "#505050" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#505050",
                  }}
                >
                  링크
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign
                  name="exclamationcircle"
                  style={{ fontSize: 65, color: "red" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#505050",
                  }}
                >
                  신고
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default function Pose({ navigation }) {
  const Tab = createMaterialTopTabNavigator();
  const { user } = useContext(UserContext);

  const RecommendPose = () => {
    //사진 있는지 여부
    const [hasImg, setHasImg] = useState(true);
    const [recommendPoses, setRecommendPoses] = useState([]);

    useEffect(() => {
      let isMount = true;
      try {
        axios({
          method: "get",
          url: "http://13.125.249.247/filme/pose?filter=3",
          headers: {
            "x-access-token": `${user?.token}`,
          },
        })
          .then(function (response) {
            const result = response.data;
            const list = [];
            for (let i = 0; i < result.length; i++) {
              list.push({
                id: result[i].idx,
                img: result[i].imageURL,
                memberIdx: result[i].memberIdx,
              });
            }
            if (isMount) {
              setRecommendPoses(list);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
        alert("Error", e);
      } finally {
        return () => {
          isMount = false;
          setRecommendPoses([]);
        };
      }
    }, [user]);

    return (
      <View>
        {hasImg ? (
          <View style={styles.content_hasImg}>
            <FlatList
              data={recommendPoses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Item item={item} />}
              numColumns={3}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.content_noImg}>
            <AntDesign name="camerao" style={{ fontSize: 85 }} />
            <Text style={{ fontSize: 22 }}>사진 없음</Text>
          </View>
        )}
      </View>
    );
  };

  const PopularPose = () => {
    //사진 있는지 여부
    const [hasImg, setHasImg] = useState(true);
    const [popularPoses, setPopularPoses] = useState([]);

    useEffect(() => {
      let isMount = true;
      try {
        axios({
          method: "get",
          url: "http://13.125.249.247/filme/pose?filter=2",
          headers: {
            "x-access-token": `${user?.token}`,
          },
        })
          .then(function (response) {
            const result = response.data;
            const list = [];
            for (let i = 0; i < result.length; i++) {
              list.push({
                id: result[i].idx,
                img: result[i].imageURL,
                memberIdx: result[i].memberIdx,
              });
            }
            if (isMount) {
              setPopularPoses(list);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
        alert("Error", e);
      } finally {
        return () => {
          setPopularPoses([]);
          isMount = false;
        };
      }
    }, [user]);

    return (
      <View>
        {hasImg ? (
          <View style={styles.content_hasImg}>
            <FlatList
              data={popularPoses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Item item={item} />}
              numColumns={3}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.content_noImg}>
            <AntDesign name="camerao" style={{ fontSize: 85 }} />
            <Text style={{ fontSize: 22 }}>사진 없음</Text>
          </View>
        )}
      </View>
    );
  };

  const RecentPose = () => {
    //사진 있는지 여부
    const [hasImg, setHasImg] = useState(true);
    const [recentPoses, setRecentPoses] = useState([]);

    useEffect(() => {
      let isMount = true;
      try {
        axios({
          method: "get",
          url: "http://13.125.249.247/filme/pose?filter=1",
          headers: {
            "x-access-token": `${user?.token}`,
          },
        })
          .then(function (response) {
            const result = response.data;
            const list = [];
            for (let i = 0; i < result.length; i++) {
              list.push({
                id: result[i].idx,
                img: result[i].imageURL,
                memberIdx: result[i].memberIdx,
              });
            }
            if (isMount) {
              setRecentPoses(list);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
        alert("Error", e);
      } finally {
        return () => {
          setRecentPoses([]);
          isMount = false;
        };
      }
    }, [user]);

    return (
      <View>
        {hasImg ? (
          <View style={styles.content_hasImg}>
            <FlatList
              data={recentPoses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Item item={item} />}
              numColumns={3}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.content_noImg}>
            <AntDesign name="camerao" style={{ fontSize: 85 }} />
            <Text style={{ fontSize: 22 }}>사진 없음</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <Tab.Navigator
        screenOptions={() => ({
          tabBarLabelStyle: {
            fontSize: 15,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#C8C8C8",
            height: 1.5,
          },
        })}
      >
        <Tab.Screen name="추천 포즈" component={RecommendPose} />
        <Tab.Screen name="인기 포즈" component={PopularPose} />
        <Tab.Screen name="최근 포즈" component={RecentPose} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  content_hasImg: {
    height: "100%",
    backgroundColor: "#fff",
    //alignItems: 'center',
    //marginBottom: 65,
  },
  img: {
    flex: 1,
    resizeMode: "cover",
    width: devWidth / 3.2,
    height: devWidth / 3.2,
    position: "relative",
  },
  content_noImg: {
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
