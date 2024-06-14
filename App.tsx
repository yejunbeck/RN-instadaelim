import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./firebaseConfig";
import { useEffect, useState } from "react";
import AuthStack from "./stacks/AuthStack";
import MainStack from "./stacks/MainStack";
import * as Firebase from "firebase/auth";
import LoadingScreen from "./screens/loading-screen";
import CreatePostScreen from "./screens/create-post/create-post-screen";

const Stack = createStackNavigator();

export default function App() {
  // user 정보
  const [user, setUser] = useState<Firebase.User | null>();
  // loading state
  const [loading, setLoading] = useState(true);
  // App.tsx가 실행될 때 with useEffect 훅 사용
  useEffect(() => {
    // User가 로그인 되었는지 안되었는지, 항시 체크
    console.log("1. 로그인 되었는지 확인 중이에요...!");

    auth.onAuthStateChanged((userState) => {
      // 로그인 여부에 따라 그룹을 각각 보여줌
      // a. 로그인 되어있음
      if (userState) {
        console.log("2-a. 로그인이 되었어요!");
        setUser(userState);
      }
      // b. 로그인 안되어있음
      else {
        console.log("2-b. 로그인이 안되어있어요 or 로그아웃!");
        setUser(null);
      }

      // 로그인 여부 파악 끝나면 로딩 off
      setLoading(false);
    });
  }, []);

  // MainStack : 로그인 YES > 이동할 스크린 모음
  // AuthStack : 로그인 NO  > 이동할 스크린 모음
  const LoadingProcess = <LoadingScreen />;
  const AuthProcess = auth.currentUser ? <MainStack /> : <AuthStack />;

  // return <CreatePostScreen />;

  return (
    <NavigationContainer>
      {loading ? LoadingProcess : AuthProcess}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
