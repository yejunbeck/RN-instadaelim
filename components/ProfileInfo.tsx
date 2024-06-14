import { User } from "firebase/auth";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { MyUser } from "../screens/profile/profile-container";
import { defaultImage } from "../utiles/utiles";

const Container = styled(View)``;
const Info = styled(View)`
  flex-direction: row;
`;
const Data = styled(View)`
  justify-content: center;
`;
const Name = styled(Text)`
  font-size: 35px;
  font-weight: bold;
`;

const Email = styled(Text)`
  font-size: 27px;
`;
const JoinDate = styled(Text)`
  font-size: 20px;
  color: #4b4b4b;
  font-weight: 400;
`;
const ProfileImg = styled(Image)`
  width: 100px;
  height: 150px;
  margin-right: 10px;
  border-radius: 5px;
  background-color: red;
`;
const CustomButton = styled(TouchableOpacity)``;

type Props = {
  user: MyUser | undefined;
  onEditImage: () => void;
};

export default ({ user, onEditImage }: Props) => {
  return (
    <Container>
      <Info>
        <CustomButton onPress={onEditImage}>
          <ProfileImg source={defaultImage(user?.photoURL)} />
        </CustomButton>
        <Data>
          <Name>{user?.name}</Name>
          <Email>{user?.email}</Email>
          <JoinDate>{user?.creationTime}</JoinDate>
        </Data>
      </Info>
    </Container>
  );
};
