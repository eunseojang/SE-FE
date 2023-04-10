import { Box } from "@chakra-ui/react";

import { CommentHeader, CommentInput } from "@/components/comment";
import { openColors } from "@/styles";

const comments = {
  comments: {
    totalSize: 100, // 댓글 + 답글
    pagenation_info: {
      comment_size: 75, // 댓글 총개수 (답글 제외)
      per_page: 25, // 한 페이지당 받을 댓글 개수
      current_page: 1, // 현재 페이지
      last_page: 3, // 마지막 페이지
    },
    data: [
      {
        comment_id: 123,
        author: {
          user_id: "m1234", //익명 사용자면, anonymous
          name: "min jeong",
        },
        created_at: "2022-05-05-12:00:02",
        modified_at: "2022-05-06-12:00:01",
        contents: "hello comments",
        isEditable: true, // 작성자가 익명 사용자면 항상 true, 작성자가 로그인 사용자면, 글 수정/삭제 가능할 시, true
        sub_comments: [
          {
            comment_id: 4322,
            tag: 123, //댓글 태그가 가능하다
            author: {
              user_id: "j1111", //익명 사용자면, anonymous
              name: "jin woo",
            },
            created_at: "2022-05-08-12:12:32",
            modified_at: "2022-05-09-15:17:01",
            contents: "comments apply",
            isEditable: true, // 작성자가 익명 사용자면 항상 true, 작성자가 로그인 사용자면, 글 수정/삭제 가능할 시, true
          },
          {
            //삭제 됬을때 -> 수정필요 (원 댓글 작성자 데이터 추가 필요)
            comment_id: 4322,
            tag: 4442, //댓글 태그가 가능하다
            author: {
              user_id: null, //익명 사용자면, anonymous
              name: "삭제된 사용자",
            },
            created_at: "2022-05-08-12:12:32",
            modified_at: "2022-05-09-15:17:01",
            contents: "삭제된 댓글 입니다.",
            isEditable: true, // 작성자가 익명 사용자면 항상 true, 작성자가 로그인 사용자면, 글 수정/삭제 가능할 시, true
          },
          {
            comment_id: 153,
            tag: 4322, // 대댓글 태그도 가능하다
            author: {
              user_id: "chung12312", //익명 사용자면, anonymous
              name: "chung yeop",
            },
            created_at: "2022-04-12-12:12:02",
            modified_at: "2022-05-01-12:45:01",
            contents: "sub comments apply",
            isEditable: true, // 작성자가 익명 사용자면 항상 true, 작성자가 로그인 사용자면, 글 수정/삭제 가능할 시, true
          },
        ],
      },
    ],
  },
};

export const CommentSection = ({ postId }: { postId: number }) => {
  return (
    <Box
      maxW="984px"
      mx="auto"
      borderBottom={`1px solid ${openColors.gray[3]}`}
      mb="100px"
    >
      <CommentHeader commentTotalSize={comments.comments.totalSize} />
      <CommentInput />
    </Box>
  );
};
