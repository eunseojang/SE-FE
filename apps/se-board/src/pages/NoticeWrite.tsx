import { Box, Hide, Show } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";

import {
  CategoryAndPrivacySetting,
  DesktopAnonymousRegister,
  DesktopCategoryAndPrivacySetting,
  DesktopFileUploader,
  MobileFileUploader,
  WritingEditor,
} from "@/components/writing";
import { useMenu } from "@/hooks/useMenu";
import { queryClient } from "@/react-query";
import {
  useGetPostQuery,
  usePostPostMutation,
  usePutPostMutation,
} from "@/react-query/hooks";
import { beforePostState, modifyPostState, writePostState } from "@/store";
import { useMobileHeaderState } from "@/store/mobileHeaderState";
import { errorHandle } from "@/utils/errorHandling";
import { isWritePostActive } from "@/utils/postUtils";

export const NoticeWrite = () => {
  const pathName = useLocation().pathname;
  const menu = useMenu().getCurrentMenu();
  const navigate = useNavigate();
  const { mobileHeaderOpen, mobileHeaderClose } = useMobileHeaderState();

  const [modifyPost, setModifyPost] = useRecoilState(modifyPostState);
  const resetModifyPost = useResetRecoilState(modifyPostState);
  const [writePost, setWritePost] = useRecoilState(writePostState);
  const resetWritePost = useResetRecoilState(writePostState);
  const [beforePost, setBeforePost] = useRecoilState(beforePostState);
  const resetBeforePost = useResetRecoilState(beforePostState);

  const isModified = useRef(false);

  const { mutate: putPostMutate, isLoading: putPostIsLoading } =
    usePutPostMutation();
  const {
    data,
    isError: getPostIsError,
    error: getPostError,
  } = useGetPostQuery(pathName.split("/")[2], isModified.current);
  const { mutate: writePostMutate, isLoading: writePostIsLoading } =
    usePostPostMutation();

  getPostIsError && errorHandle(getPostError);

  useEffect(() => {
    if (pathName.includes("modify")) {
      isModified.current = true;

      setModifyPost({
        title: data?.title || "",
        contents: data?.contents || "",
        categoryId: data?.category?.categoryId || -1,
        pined: data?.isPined || false,
        exposeOption: {
          name: data?.exposeType || "",
          password: "",
        },
        attachmentIds:
          data?.attachments.fileMetaDataList.map(
            (attachment) => attachment.fileMetaDataId
          ) || [],
      });

      setBeforePost({
        postId: data?.postId || Number(pathName.split("/")[2]),
        title: data?.title || "",
        contents: data?.contents || "",
        category: data?.category || { categoryId: -1, name: "" },
        exposeType: data?.exposeType || "",
        attachments: {
          fileMetaDataList: data?.attachments.fileMetaDataList || [],
        },
        isPined: data?.isPined || false,
      });
    }
  }, [data]);

  useEffect(() => {
    mobileHeaderClose();

    return () => {
      mobileHeaderOpen();
      resetBeforePost();
    };
  }, []);

  const onClickRegistrationInModify = () => {
    const correctPost = isWritePostActive(modifyPost, isModified.current);

    if (correctPost !== null) {
      alert(correctPost);
      return;
    }

    putPostMutate(
      { postId: Number(pathName.split("/")[2]), data: modifyPost },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(["post", data.id]);

          navigate(`/${menu?.urlId}/${data.id}`, {
            replace: true,
          });

          resetModifyPost();
        },
        onError: (error) => {
          errorHandle(error);
        },
      }
    );
  };

  const onClickRegistrationInWrite = () => {
    const correctPost = isWritePostActive(writePost, isModified.current);

    if (correctPost != null) {
      alert(correctPost);
      return;
    }
    writePostMutate(writePost, {
      onSuccess: (data) => {
        navigate(`/${menu?.urlId}/${data.id}`, {
          replace: true,
        });
        resetWritePost();
      },
      onError: (error) => {
        errorHandle(error);
      },
    });
  };

  return (
    <Box maxW="984px" w="100%" mx="auto">
      <Show above="md">
        <DesktopCategoryAndPrivacySetting isModified={isModified.current} />
        <DesktopFileUploader
          isModified={isModified.current}
          beforeFiles={beforePost?.attachments.fileMetaDataList}
        />
      </Show>
      <Hide above="md">
        <CategoryAndPrivacySetting
          isModified={isModified.current}
          onClickRegistration={
            isModified.current
              ? onClickRegistrationInModify
              : onClickRegistrationInWrite
          }
        />
        <MobileFileUploader
          isModified={isModified.current}
          beforeFiles={beforePost?.attachments.fileMetaDataList}
        />
      </Hide>
      <WritingEditor
        title={beforePost?.title}
        contents={beforePost?.contents}
        isModified={isModified.current}
      />
      <Show above="md">
        <DesktopAnonymousRegister
          isModified={isModified.current}
          onClickRegistration={
            isModified.current
              ? onClickRegistrationInModify
              : onClickRegistrationInWrite
          }
          isLoading={isModified.current ? putPostIsLoading : writePostIsLoading}
        />
      </Show>
    </Box>
  );
};
