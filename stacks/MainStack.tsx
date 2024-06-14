import { createStackNavigator } from "@react-navigation/stack";
import home from "../screens/home";
import profile from "../screens/profile/profile-screen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Tabs from "./Tabs";
import CreatePost from "../screens/create-post";

// 이동할 스크린 StackNavigator : type 지정
export type MainStackScreenList = {
  Tabs: undefined;
  CreatePost: undefined;
};

// StackNavigator 생성
const Stack = createStackNavigator<MainStackScreenList>();

export default () => {
  // Stack 안에서 이동할 스크린들 그룹화
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={"CreatePost"} component={CreatePost} />
    </Stack.Navigator>
  );
};
