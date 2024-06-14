import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  NavigationHelpersContext,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackScreenList } from "../stacks/AuthStack";

const Container = styled(ImageBackground)`
  justify-content: center;
  align-items: center;
  background-color: #c39835;
  flex: 1;
`;
const Title = styled(Text)`
  font-size: 15px;
  font-weight: 700;
  color: #750f47;
  margin-bottom: 10px;
`;
const SignBox = styled(View)`
  background-color: white;
  width: 80%;
  height: 60%;
  padding: 20px;
  border-radius: 10px;
`;
const LogoImg = styled(Image)`
  width: 100%;
  height: 30%;
`;
// Text Input (ID/PW)
const InputField = styled(View)`
  padding: 3px;
`;
const UserID = styled(TextInput)`
  background-color: #efeded;
  margin-bottom: 7px;
  font-size: 18px;
  padding: 5px 12px;
`;
const UserPW = styled(UserID)``;
const UserName = styled(UserID)``;

// Footer (Signin Btn, Create Account)
const Footer = styled(View)`
  margin-top: 15px;
`;
const SignupButton = styled(TouchableOpacity)`
  background-color: #4ba5ff;
  padding: 10px;
  align-items: center;
`;
const SignupTitle = styled(Text)`
  color: white;
  font-size: 15px;
`;

const ErrorMessage = styled(Text)`
  color: #f02d2d;
  font-size: 14px;
`;

const BGImgDir = require("../assets/instaDaelim_background.jpg");
const LogoImgDir = require("../assets/instaDaelim_title.png");

export default () => {
  // Email(ID), PW ==> state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // error message
  const [error, setError] = useState("");
  // loading state
  const [loading, setLoading] = useState(false);
  // use navigationHook
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreenList>>();

  // moving screen to singin page
  const goToSingin = () => {
    // using hook, move to previous page
    // navigation.navigate("SignIn");
    navigation.goBack();
  };

  // onChange Text(사용자 입력에 따라 변경된 Input Event를 받아온다)
  const onChangeText = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
    type: string
  ) => {
    // 1. 'e'의 담겨있는 사용자의 입력 텍스트를 가져온다.
    const inputText = e.nativeEvent.text;
    // 2. 입력 텍스트를 email, password state에 저장한다
    switch (type) {
      // 2-1. 입력 텍스트가 email이라면?
      case "email":
        setEmail(inputText);
        break;
      // 2-2. 입력 텍스트가 password라면?
      case "password":
        setPassword(inputText);
        break;
      // 2-3. 입력 테스트가 name이라면?
      case "name":
        setName(inputText);
        break;
    }
  };

  // Send Account Info to Server(Firebase)
  // 서버와 통신하기 때문에 비동기(async) 함수로 선언
  const onSubmit = async () => {
    try {
      // invalid case check
      if (name === "" || email === "" || password === "") {
        setError("please input user info");
        return;
      }
      // loading on....
      setLoading(true);

      // error message reset
      setError("");
      // input code
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      //Update User Profile with name
      await updateProfile(credential.user, {displayName : name});

      // if account creation surcess, alert
      Alert.alert("Account Created!", "", [{ onPress: () => goToSingin() }]);
    } catch (error) {
      // if encounter error
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      // always loading off after excute code..
      setLoading(false);
    }
  };

  // Screen Design
  return (
    <Container source={BGImgDir}>
      <SignBox>
        <LogoImg source={LogoImgDir} resizeMode="contain" />
        <Title>{`Welcome! Nice to meet you!\nCreate Your Account`}</Title>
        <InputField>
          <UserName
            placeholder="Name"
            value={name}
            onChange={(e) => onChangeText(e, "name")}
          />
          <UserID
            placeholder="Email"
            value={email}
            onChange={(e) => onChangeText(e, "email")}
            keyboardType="email-address"
            returnKeyType="next"
          />
          <UserPW
            placeholder="Password"
            value={password}
            onChange={(e) => onChangeText(e, "password")}
            keyboardType="visible-password"
            returnKeyType="done"
            secureTextEntry={true}
          />
          <ErrorMessage>{error}</ErrorMessage>
        </InputField>
        <Footer>
          <SignupButton onPress={() => onSubmit()}>
            <SignupTitle>
              {loading ? "Loading..." : "Create Account"}
            </SignupTitle>
          </SignupButton>
        </Footer>
      </SignBox>
    </Container>
  );
};
