import { Timestamp, collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import { db } from "../firebaseConfig";
import Post from "./Post";
import { Unsubscribe } from "firebase/auth";

export type PostType = {
  id: string;
  userId: string;
  username: string;
  createdAt: Timestamp;
  caption: string;
  photoUrls: string[];
  likes: string[];
};

const Container = styled(View)``;

const Timeline = () => {
  // fireabase 서버로부터 받아온 게시글을 저장할 state를 생성합니다.
  // - useState의 타입은 우리가 임의로 생성한 PostType 타입을 사용합니다.
  // * PostType 타입은 게시글을 보여주기 위해 만들어둔 Component에서 사용되는 타입입니다.
  const [posts, setPosts] = useState<PostType[]>([]);

  // useEffect를 활용해, 페이지가 나타날 때 한 번 실행합니다.
  useEffect(() => {
    // 1.게시글(Post)을 실시간으로 받아올 기능(Listener)을 가지고 있을 빈 변수를 하나 생성합니다.
    let unsubscribe: Unsubscribe | null = null;

    // 2.게시글을 실시간으로 받아올 기능을 가진 함수를 생성합니다.
    const fetchPosts = async () => {
      // --------------- A.맨 처음, 서버에 저장되어있는 게시글들을 가져온다. -------------------
      // 2-1.firebase 서버의 "Firestore"(db) 안에 존재하는 "posts"라는 폴더(collenction) 에서 생성날짜(createdAt)를 내림차순(desc)으로 정렬해 가져오도록 부탁하는 쿼리(query)를 생성합니다.
      const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      // 2-2.방금 만든 쿼리(query)를 firebase 서버에 전달해서, 조건에 맞는 게시글(post)의 해당하는 데이터(doc)들을 가져와 snapshot 변수에 저장합니다.
      const snapshot = await getDocs(postsQuery);

      // 2-3.snapshot 안에 저장된, 불러온 게시글 데이터(doc)들에 하나씩 접근해 필요한 정보(Field)들을 하나씩 꺼내줍니다.
      // * snapshot 변수 안에는 내가 생성날짜(createdAt) 순으로 가져온 게시글이 여러 개 들어있습니다.
      // - snapshot : 게시글(post)들을 doc 형태로 가지고 있음
      // - snapshot.docs : 여러 게시글 데이터를 [] 리스트 형태로 가지고 있음
      // - snapshot.docs.map( (doc)=>{} ) : map()을 활용하여 doc형태로 가지고 있는 게시글들 중에서 doc에 하나씩 접근한다. (*카드지갑에서 카드를 빼듯)
      // - doc.data() : snapshot이 가지고 있는 게시글 데이터 1개에 해당하는 정보
      const downloadPosts = snapshot.docs.map((doc) => {
        // 접근한 1개의 게시글 정보로부터 upload 할 때 설정한 데이터들을 가져온다.
        const { userId, username, createdAt, caption, photoUrls, likes, comments } = doc.data();
        // 반환한 정보들은 "const posts" 배열 안에 하나씩 추가 되는 형태로 저장된다.
        // * posts = [ {post_1}, {post_2}, ... ]
        return {
          id: doc.id,
          userId,
          username,
          createdAt,
          caption,
          photoUrls,
          likes,
          comments,
        };
      });
      // 3. 가져온 게시글 리스트들을 setPosts를 통해 useState 에 저장해준다.
      setPosts(downloadPosts);

      // --------------- B. instadaelim을 사용하는 사용자가 게시글을 업로드하거나 수정/삭제한 경우 실시간으로 변동된 사항을 가져온다. -------------------
      // 4.Firebase 서버에 변동사항(추가/수정/삭제)이 생길 때마다 새롭게 게시글(Post)데이터들을 실시간으로 받아올 수 있도록 계속 동작하는 Listener 함수를 만들어 등록한다.
      // * listener : 한 번 동작하면, 해제하지 않는 이상 어떤 값이 수정되었는지 등등의 기능을 하는 계속해서 동작하는 형태의 함수
      // - onSnapshot() : firebase 서버에서 수정사항이 생기는지 여부를 실시간으로 감시하는 listener함수
      // - snapshot.docChanges() : 특정 조건을 만족하는 데이터들이 변동되었을 때, 실행되는 함수
      // - foreach() : for문과 같은 기능을 하며, map()처럼 리스트가 가진 각 요소에 1개씩 개별적으로 접근 가능하다.
      // 4-1. "2-1"번에서 만든 내가 "postsQuery"를 서버에 전달해, 조건에 맞는 게시글(Post) 리스트들을 snapshot 형태로 가져온다.
      unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        // 4-2. 게시글(post) 리스트 중 하나라도 만일 변동된다면, 해당 게시글(post) 변동된 데이터 정보를 알려준다.
        snapshot.docChanges().forEach((change) => {
          // 4-3. 만일 변동사항이 "수정(좋아요/좋아요해제, 댓글달기 등)"이나 "삭제"가 되었다면?
          if (change.type === "modified" || change.type === "removed") {
            // 4-4. 위에 해당하는 변동사항(수정/삭제)이 일어난 게시글 정보를 다시 불러온다.
            const modifiedPosts = snapshot.docs.map((doc, idx) => {
              // 4-5. 수정된 게시글 리스트들 중 1개씩 접근하여, 해당 게시글이 가지고 있는 데이터(field)를 꺼낸다.
              const { userId, username, createdAt, caption, photoUrls, likes, comments } = doc.data();

              // 4-6. 꺼낸 게시글 정보를 불러와 "modifiedPosts" 리스트에 하나씩 추가하여 저장한다.
              return {
                id: doc.id,
                userId,
                username,
                createdAt,
                caption,
                photoUrls,
                likes,
                comments,
              };
            });
            // setPosts를 통해 수정된 게시글 정보를 timeline에서 보여줄 useState에 저장한다.
            setPosts(modifiedPosts);
          }
        });
      });
    };

    // 5.위에 만든 게시글(Post)을 리얼타임으로 받아오는 기능을 가진 함수를 실행합니다.
    fetchPosts();

    // 6.사용자가 현재 화면에서 벗어나는 경우,
    return () => {
      // 만일 해제해야할 리얼타임 수정 기능이 작동 중이라면, 리얼타임 수정하는 기능을 해제 합니다.
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Container>
      {/* useEffect를 통해 불러온 게시글을 임의로 제작한 Post 컴포넌트를 이용해 화면에 보여준다. */}
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Container>
  );
};

export default Timeline;
