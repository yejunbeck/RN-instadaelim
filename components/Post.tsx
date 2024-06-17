import { Alert, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { PostType } from "./Timelines";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { MainStackScreenList } from "../stacks/MainStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { defaultImage } from "../utils/utils";

// Get My Device Screen Width/Height
const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

const Container = styled(View)`
  margin-bottom: 10px;
`;
const Header = styled(View)`
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Footer = styled(View)`
  padding: 12px;
  flex-direction: row;
`;
const Contents = styled(View)`
  padding: 12px;
`;
const User = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const Name = styled(Text)`
  font-size: 17px;
`;
const Profile = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 10px;
`;
const Creation = styled(Text)`
  color: #565656;
`;
const Caption = styled(Text)`
  font-size: 20px;
  margin-bottom: 10px;
`;
const Photo = styled(Image)``;
const PhotoScroll = styled(ScrollView)``;
const Indicator = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 12px;
  top: 12px;
  width: 100%;
  height: 100%;
`;
const Circle = styled(View)`
  width: 8px;
  height: 8px;
  border-radius: 30px;
  margin-right: 5px;
`;

const DeleteBtn = styled(TouchableOpacity)``;
const LikesCount = styled(Text)`
  color: #969696;
`;
const CommenctBtn = styled(TouchableOpacity)`
  margin-bottom: 10px;
`;
const CommentsCount = styled(Text)`
  color: #969696;
`;

const Post = ({ id, userId, username, photoUrls, createdAt, caption, likes }: PostType) => {
  // 로그인한 유저 정보
  const user = auth.currentUser;
  // 게시글을 작성한 사람이 현재 로그인한 유저(당신)인지 아닌지 체크
  const isWriter = user?.uid === userId;
  // 게시글(post)에 이미지가 여러가지인 경우, 현재 몇 번째 페이지에 있는 이미지를 보고 있는지에 대한 정보를 저장할 state
  const [currentPage, setCurrentPage] = useState(0);
  // 어떤 유저가 게시글을 올렸는지 확인하는, 업로드 유저의 프로필 url 을 저장할 state
  const [profile, setProfile] = useState("");
  // navigation hook
  const navigation = useNavigation<NativeStackNavigationProp<MainStackScreenList>>();

  // 게시글 이미지 스크롤에 따라, 이미지 표시기에서 이미지 현재 위치 변경
  const onChangeScrollPageIndicator = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 1.현재 이미지를 담은 스크롤 영역의 사이즈
    const { contentOffset } = event.nativeEvent;
    // 2. 이미지 사이즈를 기반으로 현재 페이지 번호 위치를 가져온다.
    // - contentOffset.x : 스크롤 영역의 가로 사이즈
    // - WIDTH : 현재 디바이스의 가로 화면 사이즈
    // - contentOffset.x / WIDTH : 게시글 이미지 하나가 차지하는 영역의 가로 길이
    // - Math.round : 소수점 반올림하여 정수형태로 만들어주는 함수
    const page = Math.round(contentOffset.x / WIDTH);
    // 3. 알아낸 현재 이미지의 페이지 번호 위치를 현재 페이지 위치로 설정하여 state 갱신
    if (currentPage !== page) setCurrentPage(page);
  };

  // 게시글을 업로드한 유저의 프로필 이미지 가져오기
  const initProfile = async () => {
    // 해당 유저 ID에 해당하는 Firebase-Storage 안에 프로필 이미지를 불러올 경로 지정
    const locationRef = ref(storage, `profiles/${userId}`);
    // A.정상 동장(try) : 프로필 이미지를 다운로드 받아 State를 갱신
    try {
      const profileURL = await getDownloadURL(locationRef);
      setProfile(profileURL);
    } catch (e) {
      // B.에러(catch) : 에러가 발생한 경우, 실행(ex,유저의 프로필이미지가 설정이 안되어 데이터가 없는 경우)
      // 넘어가도 되는 에러이므로 따로 처리되는 코드는 없다.
    }
  };

  // 게시글 삭제하기
  const onDelete = () => {
    // A.현재 게시글을 작성한 사람이 아니거나, B.로그인한 상태가 아니면 삭제하기 기능안 사용하지 못하게 종료
    if (isWriter || !user) return;
    // 게시글 삭제하기 함수
    const remove = async () => {
      try {
        // Firebase-firestore 의 "posts" 폴더(collection) 안에 있는 현재 게시글 Id 와 일치하는 게시글 데이터(doc) 삭제
        await deleteDoc(doc(db, "posts", id));
        // Firebase-Storage 의 'posts' 폴더에 저장된 해당 게시글의 해당하는 게시글 이미지 정보 가져오기
        const photoRef = ref(storage, `posts/${user.uid}/${id}`);
        // 해당 경로에 존재하는 이미지 object 삭제하기
        await deleteObject(photoRef);
      } catch (e) {
        // 에러 발생 시, 로그에서 에러 미시지 띄우기
        console.warn(e);
      }
    };

    // "정말 삭제하시겠습니까?" 알림창 띄우기
    // - 취소 : 알림창 닫기
    // - 삭제 : 위에서 만든 remove() 함수를 실행하기
    Alert.alert("경고", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", onPress: remove, style: "destructive" },
    ]);
  };

  // 페이지 진입 시, 한 번 실행
  useEffect(() => {
    // 게시글을 작성한 유저의 프로필 이미지 받아오기
    initProfile();
  }, []);

  return (
    <Container>
      <Header>
        {/* 유저 프로필 이미지 & 유저이름(이름 없으면 "Unkown User") */}
        <User>
          <Profile source={defaultImage(profile)} />
          <Name>{username ? username : "Unknown User"}</Name>
        </User>
        {/* 내가 작성한 게시글이면 삭제하기 버튼 보여주기 */}
        {isWriter && (
          <DeleteBtn onPress={onDelete}>
            <MaterialCommunityIcons name="tray-remove" size={28} color={"#595959"} />
          </DeleteBtn>
        )}
      </Header>
      {/* 게시글 이미지 (가로 Snap 자석 스크롤) */}
      <PhotoScroll
        style={{ width: WIDTH, height: WIDTH }}
        horizontal // 가로 스크롤
        showsHorizontalScrollIndicator={false} // 가로 스크롤 표시기 숨기기
        pagingEnabled // 페이징 기능 사용
        onScroll={onChangeScrollPageIndicator} // 스크롤 할 때 실행되는 함수 => 스크롤 할 때마다, 표시기에서 페이지 위치 갱신
        scrollEventThrottle={16} // 스크롤 민감도 (낮을 수록 민감)
      >
        {/* 게시글이 가지고 있는 이미지 나열하기 */}
        {photoUrls?.map((photo) => (
          <Photo key={photo} source={{ uri: photo }} style={{ width: WIDTH, height: WIDTH }} />
        ))}
      </PhotoScroll>
      <Footer>
        {/* 게시글 이미지가 2개 이상 여러 개인 경우, 이미지 위치 표시기 */}
        {photoUrls?.length > 1 && (
          <Indicator>
            {photoUrls?.map((photo, index) => (
              <Circle key={index} style={{ backgroundColor: index === currentPage ? "#71a8dc" : "#d6d6d6" }} />
            ))}
          </Indicator>
        )}
        {/* 좋아요버튼 (동작안함) */}
        <PostIcon name="heart-outline" />
        {/* 댓글 버튼 (동작안함) */}
        <PostIcon name="chatbubble-outline" />
        {/* 공유 버튼 (동작안함) */}
        <PostIcon name="paper-plane-outline" />
      </Footer>
      <Contents>
        {/* 좋아요 카운트 */}
        <LikesCount>{`0 liked this post`}</LikesCount>
        {/* 게시글 캡션(재가 쓴 글) */}
        <Caption>{caption}</Caption>
        {/* 현재 달린 댓글 수 버튼(동작 안함) */}
        <CommenctBtn>
          <CommentsCount>{`View all 99 comments`}</CommentsCount>
        </CommenctBtn>
        {/* 게시글 생성 날짜 */}
        <Creation>{`${createdAt.toDate().toLocaleString()}`}</Creation>
      </Contents>
    </Container>
  );
};

export default Post;

// ----(시작)----- Post 게시글에 사용될 아이콘 버튼 컴포넌트 ----(시작)-----
const Btn = styled(TouchableOpacity)`
  margin-right: 8px;
`;

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  onPress?: () => void;
}

const PostIcon = ({ onPress, size = 26, name }: Props) => {
  return (
    <Btn onPress={onPress}>
      <Ionicons size={size} name={name} />
    </Btn>
  );
};
// -----(끝)---- Post 게시글에 사용될 아이콘 버튼 컴포넌트 -----(끝)----
