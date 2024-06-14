import { useNavigation } from "@react-navigation/native";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as Firebase from "firebase/auth"; // cheat sheet
import { auth } from "../firebaseConfig";
import styled from "styled-components";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackScreenList } from "../stacks/MainStack";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeContainer = styled(SafeAreaView)``;

const Header = styled(View)`
  padding: 10px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const LogoImg = styled(Image)`
  width: 150px;
  height: 30px;
`;
const AddButton = styled(TouchableOpacity)``;

const ScrollContainer = styled(ScrollView)``;
const DummyItem = styled(View)`
  width: 90%;
  height: 250px;
  margin-bottom: 10px;
  background-color: #9dd8f6;
`;

// function : function & arrow func
export default () => {
  // navigation Hook ex)useXXX()
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackScreenList>>();
  //move to create-post-screen
  const goToCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  // design screen
  return (
    <SafeContainer>
      <Header>
        <LogoImg source={require("../assets/instaDaelim_title.png")} />
        <AddButton onPress={goToCreatePost}>
          <Ionicons name="add-circle-outline" size={30}></Ionicons>
        </AddButton>
      </Header>
      <ScrollContainer>
        <DummyItem />
        <DummyItem />
        <DummyItem />
        <DummyItem />
        <DummyItem />
        <DummyItem />
        <DummyItem />
      </ScrollContainer>
    </SafeContainer>
  );
};
