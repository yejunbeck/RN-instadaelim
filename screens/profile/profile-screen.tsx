import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import ProfileInfo from "../../components/ProfileInfo";
import { User } from "firebase/auth";
import { MyUser } from "./profile-container";

const Scroll = styled(ScrollView)`
  flex: 1;
  background-color: white;
`;
const Header = styled(View)`
  height: 200px;
  justify-content: flex-end;
  bottom: -20px;
  z-index: 99;
  padding: 0px 30px;
`;
const Body = styled(View)`
  height: 500px;
  background-color: lightgrey;
`;

const SignoutBtn = styled(TouchableOpacity)`
  background-color: #adadad;
  border-radius: 4px;
  padding: 5px 15px;
`;
const SignoutTitle = styled(Text)`
  color: #7c7c7c;
`;

type Props = {
  user: MyUser | undefined;
  onSignout: () => void;
  onEditImage: () => void;
};
// function : function & arrow func
export default ({ user, onSignout, onEditImage }: Props) => {
  // design screen
  return (
    <Scroll>
      <Header>
        <ProfileInfo user={user} onEditImage={onEditImage} />
      </Header>
      <Body>
        <SignoutBtn onPress={onSignout}>
          <SignoutTitle>로그아웃</SignoutTitle>
        </SignoutBtn>
      </Body>
    </Scroll>
  );
};
