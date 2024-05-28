import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { CommentListItemDTO } from "@types";
import { Link } from "react-router-dom";

import { Pagination } from "@/components";
import { useMyCommentSearchParams } from "@/hooks";
import { toYYMMDD_DOT } from "@/utils/dateUtils";

const columnHelper = createColumnHelper<CommentListItemDTO>();

const columns: ColumnDef<CommentListItemDTO, any>[] = [
  columnHelper.accessor("number", {
    header: "번호",
    cell: (info) => {
      return info.getValue();
    },
  }),
  columnHelper.accessor("contents", {
    header: "내용",
    cell: (info) => {
      const { postId } = info.row.original;
      return (
        <Flex alignItems="center">
          <Link to={`/posts/${postId}`}>
            <Text
              noOfLines={1}
              _hover={{
                textDecoration: "underline",
                textDecorationColor: "gray.6",
              }}
            >
              {info.getValue()}
            </Text>
          </Link>
        </Flex>
      );
    },
  }),
  columnHelper.accessor("author.name", {
    header: "작성자",
    cell: (info) => (
      <Flex justifyContent="flex-start">
        <Menu autoSelect={false}>
          <MenuButton>
            <Text whiteSpace="nowrap" textAlign="left">
              {info.getValue()}
            </Text>
          </MenuButton>
          <MenuList>
            <MenuItem>작성글 보기</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "작성일",
    cell: (info) => toYYMMDD_DOT(info.getValue()),
  }),
];

const columnWidth = ["10%", "70%", "10%", "10%"];

interface CommentTableProps {
  data: CommentListItemDTO[];
  totalItems?: number;
  perPage: number;
  page?: number;
}

export const CommentTable = ({
  data,
  totalItems = 0,
  perPage,
  page,
}: CommentTableProps) => {
  const table = useReactTable<CommentListItemDTO>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { setPageSearchParam } = useMyCommentSearchParams();

  const onChange = (page: number) => {
    setPageSearchParam(page);
    window.scrollTo(0, 0);
  };

  const titleColor = useColorModeValue("gray.7", "whiteAlpha.800");
  const borderColor = useColorModeValue("gray.3", "whiteAlpha.400");

  return (
    <Flex direction="column" alignItems="center" gap="2rem" w="full">
      <ChakraTable>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <Th
                  key={header.id}
                  w={columnWidth[i]}
                  fontSize="md"
                  textAlign="center"
                  borderColor={borderColor}
                  color={titleColor}
                  whiteSpace="nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row, i) => (
            <Tr key={i} fontSize="sm">
              {row.getVisibleCells().map((cell, i) => (
                <Td
                  key={cell.id}
                  w={columnWidth[i]}
                  textAlign={cell.column.id === "title" ? "left" : "center"}
                  borderColor={borderColor}
                  color={titleColor}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
      <Pagination
        currentPage={page || 0}
        totalPage={Math.ceil(totalItems / perPage) || 1}
        onChangePage={onChange}
      />
    </Flex>
  );
};
