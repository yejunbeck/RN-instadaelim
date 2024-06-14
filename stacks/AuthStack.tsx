import { createStackNavigator } from "@react-navigation/stack";
import signinScreen from "../screens/signin-screen";
import signupScreen from "../screens/signup-screen";

// AuthStack에서 이동할 스크린 타입
export type AuthStackScreenList = {
  SignIn: undefined;
  SignUp: undefined;
};

// StackNavigator 생성
const Stack = createStackNavigator<AuthStackScreenList>();

export default () => {
  // Stack안에 이동할 페이지 만들어 그룹화
  // - 로그인 화면(SignIn)
  // - 회원가입 화면(SignUp)
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={signinScreen} />
      <Stack.Screen name="SignUp" component={signupScreen} />
    </Stack.Navigator>
  );
};
