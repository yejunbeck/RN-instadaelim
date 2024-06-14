import { useEffect, useState } from "react";
import ProfileScreen from "./profile-screen";
import { auth, storage } from "../../firebaseConfig";
import { User, signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { assetToBlob } from "../../utiles/utiles";

export type MyUser = {
  name: string | null;
  email: string | null;
  creationTime: string | undefined;
  photoURL: string | null;
};

export default () => {
  // 1. 데이터를 불러오고, 가공하고, 수정한다
  const [user, setUser] = useState<MyUser>();

  //프로필 이미지 변경 함수
  const onEditImage = async () => {
    //0. 이미지 앨범 접근 권한
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    //0.a 만약 거절한 경우...
    if (permission.status === ImagePicker.PermissionStatus.DENIED) {
      //다시 한번 권한을 설정할 수 있도록 안내
      Alert.alert("알림", "사진에 접근하려면 권한을 설정해주세요", [
        { text: "확인", style: "default", onPress: () => Linking.openSettings },
      ]);
    } else if (
      permission.status === ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      return await ImagePicker.requestCameraPermissionsAsync();
    }
    //1. 이미지 고르기
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });
    //2-a 이미지 정상적으로 선택된 경우
    if (!result.canceled && auth.currentUser) {
      //Firebase에 저장할 위치
      //ㄴ 1.유저 아이디
      const userId = auth.currentUser.uid;
      //ㄴ 2.저장 경로
      const path = `profiles/${userId}`;
      const firebasePath = ref(storage, path);
      //Firebase에 업로드
      //내가 선택한 이미지의 URI 경로 가져오기
      const locationUri = result.assets[0].uri;
      //1-a. 내 이미지를 BinaryLargeObject 변환
      const blob = await assetToBlob(locationUri);
      //1-b 변환된 데이터를 firebase에 업로드
      const uploadTask = await uploadBytes(firebasePath, blob);
      // firebase에 업로드된 이미지의 uri가져오기
      const photoURL = await getDownloadURL(uploadTask.ref);
      //스크린에서 내 바뀐 프로필 이미지로 새로고침
      // ㄴ1. 서버에서의 나의 프로필 이미지 업데이트
      await updateProfile(auth.currentUser, {
        photoURL,
      });
      // ㄴ2. 로컬(App)화면에서 나의 프로필 이미지 갱신
      setUser({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        creationTime: auth.currentUser.metadata.creationTime,
        photoURL,
      });
    }
    //2-b 이미지 비정상
    //2. 이미지를 고른 후, 서버(Firebase)에 업데이트
  };

  // 로그아웃 기능 함수
  const onSignOut = async () => {
    await signOut(auth);
  };

  //firebase(Server)에서 User의 정보를 불러온다
  const getUserData = () => {
    //1. firebase의 유저 정보 가져온다
    const user = auth.currentUser;
    //2. 유저 정보가 있다면,
    if (user) {
      //유저의 정보를 저장s
      setUser({
        name: user.displayName,
        email: user.email,
        creationTime: user.metadata.creationTime,
        photoURL: user.photoURL,
      });
    }
  };

  // profile 페이지가 실행될 때, 딱 1번
  useEffect(() => {
    getUserData();
  }, []);
  // Input code...
  // 2. 가공한 데이터를 Presenter에 넘겨준다.
  return (
    <ProfileScreen
      user={user}
      onSignout={onSignOut}
      onEditImage={onEditImage}
    />
  );
};
