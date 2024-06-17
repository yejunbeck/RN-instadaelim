import { useEffect, useState } from "react";
import { Button, Image, NativeSyntheticEvent, Text, TextInput, TextInputChangeEventData, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackScreenList } from "../../stacks/MainStack";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { assetToBlob } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";

const Container = styled(View)``;
const Title = styled(Text)``;

const Information = styled(View)`
  flex-direction: row;
  padding: 15px;
`;
const Photo = styled(Image)`
  width: 120px;
  height: 120px;
  background-color: red;
`;
const CaptionBox = styled(View)`
  margin-left: 15px;
`;
const InputCaption = styled(TextInput)``;

type Props = NativeStackScreenProps<MainStackScreenList> & {
  // add my props..
};

export default ({ route: { params } }: NativeStackScreenProps<MainStackScreenList, "CreatePostDetail">) => {
  // Text Input - useStateHook
  const [caption, setCaption] = useState("");
  // Upload Photos from "Create Post" screen. - useState Hook
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);

  // + Navigation Hook
  const nav = useNavigation<NativeStackNavigationProp<MainStackScreenList>>();
  // + Main 화면으로 이동 (업로드 완료하고 나서)
  const goBackMain = () => {
    nav.reset({
      index: 0,
      routes: [{ name: "Tabs" }],
    });
  };

  // Change Text Func
  const onChangeText = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    // my text
    const text = e.nativeEvent.text;
    // set Caption
    setCaption(text);
  };

  // Upload - Submit "Post Data" to "Firebase Server"
  const onSubmit = async () => {
    // check signin
    const user = auth.currentUser;
    if (!user) return;

    // send data to server
    // 1.caption
    // 1-1. add document + etc data...
    const doc = await addDoc(collection(db, "posts"), {
      caption: caption,
      createdAt: new Date(),
      userId: user.uid,
      userName: user.displayName,
      likes: [],
      commnets: [],
    });

    // 2.photos
    const photoUrls = [];
    for (const photo of photos) {
      // 2-2. set upload path
      const uploadPath = `posts/${user.uid}/${doc.id}/${photo.id}`;
      // 2-1. add image to storage
      const location = ref(storage, uploadPath);
      // 2-3. convert image to Blob
      const blob = await assetToBlob(photo.uri);
      // 2-4. upload converted image
      const uploadResult = await uploadBytesResumable(location, blob);
      // 2-5. download photo url
      const photoUrl = await getDownloadURL(uploadResult.ref);

      // [...photoUrls, photoUrl]
      photoUrls.push(photoUrl);
    }
    // 1-2. update photo
    await updateDoc(doc, {
      photoUrls: photoUrls,
    });

    // ++ 업로드 완료된 후, Main 화면으로 이동
    goBackMain();
  };

  // when page rendered, get params data...
  useEffect(() => {
    setPhotos(params.photos);
  }, []);

  return (
    <Container>
      <Information>
        <Photo source={{ uri: photos[0]?.uri }} />
        <CaptionBox>
          <Title>Caption</Title>
          <InputCaption
            placeholder="Input Caption..."
            placeholderTextColor={"#b1b1b1"}
            multiline={true}
            onChange={(e) => onChangeText(e)}
            value={caption}
          />
        </CaptionBox>
      </Information>
      <Button title="Upload" onPress={onSubmit} />
    </Container>
  );
};
