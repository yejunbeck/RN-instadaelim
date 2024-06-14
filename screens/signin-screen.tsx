import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { FirebaseError } from "firebase/app";
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

// Footer (Signin Btn, Create Account)
const Footer = styled(View)`
  margin-top: 15px;
`;
const SigninButton = styled(TouchableOpacity)`
  background-color: #4ba5ff;
  padding: 10px;
  align-items: center;
`;
const SigninTitle = styled(Text)`
  color: white;
  font-size: 15px;
`;
const CreationGuide = styled(Text)`
  color: #acacac;
  text-align: center;
`;
const CreateAccount = styled(Text)`
  color: #4ba5ff;
  text-align: center;
  text-decoration: underline;
  margin-bottom: 10px;
`;
const ErrorMessage = styled(Text)`
  font-size: 14px;
  color: #f02d2d;
`;

const BGImgDir = require("../assets/instaDaelim_background.jpg");
const LogoImgDir = require("../assets/instaDaelim_title.png");

export default () => {
  // Email(ID), PW ==> state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Error message
  const [error, setError] = useState("");
  // loading state
  const [loading, setLoading] = useState(false);
  // use navigation hook + typescript
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreenList>>();

  // for moving screen
  const goToSignup = () => navigation.navigate("SignUp");

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
    }
  };

  // onSubmit account info for signin
  const onSubmit = async () => {
    try {
      // invalid input check..
      if (email === "" || password === "") {
        setError("Please Input user info ...");
        return;
      }
      // loading on ..
      setLoading(true);
      // reset error message
      setError("");
      // info : 1.auth , 2.email, 3.pw
      await signInWithEmailAndPassword(auth, email, password);
      // if signin success, alert!
      Alert.alert("Sign In Success!");
    } catch (error) {
      // if encounter error
      if (error instanceof FirebaseError) {
        // set error message
        setError(error.message);
      }
    } finally {
      // loading off...
      setLoading(false);
    }
  };

  // Screen Design
  return (
    <Container source={BGImgDir}>
      <SignBox>
        <LogoImg source={LogoImgDir} resizeMode="contain" />
        <Title>Welcome my instadaelim app!!</Title>
        <InputField>
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
          />
          <ErrorMessage>{error}</ErrorMessage>
        </InputField>
        <Footer>
          <CreationGuide>Already have an account?</CreationGuide>
          <CreateAccount onPress={() => goToSignup()}>
            Create Account
          </CreateAccount>
          <SigninButton onPress={() => onSubmit()}>
            <SigninTitle>{loading ? "Loading..." : "Sign in"}</SigninTitle>
          </SigninButton>
        </Footer>
      </SignBox>
    </Container>
  );
};
