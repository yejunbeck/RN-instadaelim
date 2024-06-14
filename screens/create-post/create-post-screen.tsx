import { Album } from "expo-media-library";
import { Dimensions, ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import styled from "styled-components";
import * as MediaLibrary from "expo-media-library";
import LoadingScreen from "../loading-screen";
import { Ionicons } from "@expo/vector-icons";
//get My Device Screen Width/Height
const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
// 내 앨범 이미지를 한 줄에 배치할 갯수
const numOfItemPreLine = 5;
// 내가 선택한 이미지의 크기
// 내가 선택한 이미지 왼쪽 여백
const mainPhotoSize = WIDTH * 0.75;

const Container = styled(View)``;
const Title = styled(Text)``;

const SelectedPhotoScroll = styled(ScrollView)`
  background-color: green;
  width: ${WIDTH}px;
  height: ${WIDTH}px;
`;
const PhotoSelected = styled(View)`
  width: ${mainPhotoSize}px;
  height: ${mainPhotoSize}px;
  background-color: red;
`;
const PhotoSelectedImg = styled(Image)`
  width: 100%;
  height: 100%;
`;

const AlbumPhotoScroll = styled(ScrollView)``;
const Media = styled(TouchableOpacity)`
  width: ${WIDTH / numOfItemPreLine}px;
  height: ${HEIGHT / numOfItemPreLine}px;
  border-width: 0.5px;
`;
const AlbumImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

//선택되었는지 여부를 나타내는 Cirlce
const SelectedCircle = styled(View)`
  background-color: white;
  border-radius: 30px;
  border-width: 0.5px;
  position: absolute;
  width: 25%;
  height: 25%;
  right: 0px;
  margin: 7px;
  justify-content: center;
  align-items: center;
`;

type Props = {
  album: MediaLibrary.Asset[] | undefined;
  mainPhotos: MediaLibrary.Asset[] | undefined;
  loading: boolean;
};

export default ({ album, mainPhotos, loading }: Props) => {
  // 이미지가 선택되었는지?
  const isSelect = (asset: MediaLibrary.Asset) => {
    // 전달 받은 에셋이 mainPhotos 안에 존재한다면
    if()
    // mainPhotos 안에 asset이 있는지 확인
    const findIndex = mainPhotos?.findIndex((photo) => {
      return photo.id === asset.id
    });
    if (findIndex > -1) {
      // a. 선택되었다. true
      return true;
    } else {
      // b. 선택되지 않았다. false
      return false;
    }
  };
  // 이미지를 선택!
  const selectedPhoto = (asset:MediaLibrary.Asset) => {
    // a. 내가 선택하지 않은, 새로운 이미지인 경우,
    // mainPhoto 이미지 추가
    mainPhotos?.findIndex
    // b. 이미 선택한 이미지인 경우
    // mainPhoto 이미지 삭제
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      <Title>Create Post Screen</Title>
      <SelectedPhotoScroll
        horizontal={true}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {mainPhotos?.map((photo) => {
          return (
            <PhotoSelected>
              <PhotoSelectedImg source={{ uri: photo.uri }} />
            </PhotoSelected>
          );
        })}
      </SelectedPhotoScroll>
      <Title>Album Photo</Title>
      <AlbumPhotoScroll
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {album?.map((asset) => {
          // 에섯이 선택되어 있는지?
          const select = isSelect(asset);
          return (
            <Media onPress={()=>selectedPhoto{asset}}>
              <AlbumImage source={{ uri: asset.uri }} />
              <SelectedCircle>
                {select && <Ionicons name="checkmark-outline" size={25} />}
              </SelectedCircle>
            </Media>
          );
        })}
      </AlbumPhotoScroll>
    </Container>
  );
};
