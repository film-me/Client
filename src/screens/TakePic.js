import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert, ImageBackground, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

let camera = Camera;

export default function TakePic({ route }) {

  const { frame } = route.params;

  const devWidth = Dimensions.get("window").width;
  const devHeight = Dimensions.get("window").height;

  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState(null)
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState('off')

  const navigation = useNavigation();

  const __startCamera = async () => {
    setStartCamera(true)
    // const {status} = await Camera.requestPermissionsAsync()
    // console.log(status)
    // if (status === 'granted') {
    //   setStartCamera(true)
    // } else {
    //   Alert.alert('Access denied')
    // }
  }
  const __takePicture = async () => {
    const photo = await camera.takePictureAsync()
    console.log(photo)
    console.log(photo.uri)
    setPreviewVisible(true)
    //setStartCamera(false)
    setCapturedImage(photo)
  }
  const __savePhoto = () => {
    
   }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }

  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {previewVisible && capturedImage ? (
            //사진 찍은 후 화면
            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
          ) : (
            //카메라 화면
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                      borderRadius: 100,
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 20,
                      //borderRadius: '50%',
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      {cameraType === 'front' ? '🤳' : '📷'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between',
                    backgroundColor: '#C8C8C8'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center', 
                    }}
                  >
                    <TouchableOpacity
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        // 첫 화면(사진 찍기 전)
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles.header}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>사진 촬영</Text>
          </View>

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Image source={frame} style={{ width: devWidth, height: devHeight - 160 }} />
          </View>
          
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: devWidth,
              borderRadius: 10,
              backgroundColor: '#E8E8E8',
              //flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
            }}
          >
            <Text
              style={{
                color: '#505050',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center'
              }}
            >
              사진 찍기
            </Text>
          </TouchableOpacity>
          
        </View>
      )}

      <StatusBar backgroundColor='white' barStyle='dark-content' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

//사진 찍은 후 화면
const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
  console.log('sdsfds', photo)
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                //borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                다시 촬영
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                //borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                저장하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}