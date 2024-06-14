//assets => Blob 데이터로 변환
/**
 *
 * @param uri image uri 데이터
 * @returns blob 데이터
 */

export const assetToBlob = async (uri: string) => {
  //1. network fetch를 사용해서 정보를 받아온다
  const respone = await fetch(uri);
  //2. 정보 중에 blob 데이터를 뽑아냅니다.
  const blob = respone.blob();
  //3. 뽑아낸 blob 데이터를 반환
  return blob;
};

export const defaultImage = (uri: string | undefined | null) => {
  if (uri) {
    return { uri };
  } else {
    return require("../assets/icon.png");
  }
};
