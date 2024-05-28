import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BsSearch } from "react-icons/bs";

import { usePostSearchParams } from "@/hooks/usePostSearchParams";

export const PostSearchForm = () => {
  const [inputs, setInputs] = React.useState({
    searchOption: "ALL",
    query: "",
  });
  const { searchOption, query, search } = usePostSearchParams();
  const color = useColorModeValue("gray.7", "whiteAlpha.800");

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search(inputs.searchOption, inputs.query);
  };

  useEffect(() => {
    setInputs({ searchOption, query });
  }, [searchOption, query]);

  return (
    <form onSubmit={onSearch}>
      <Flex gap="0.5rem" w="full">
        <Select
          value={inputs.searchOption}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, searchOption: e.target.value }))
          }
          name="option"
          rounded="full"
          w="13rem"
          color={color}
        >
          <option value="ALL">전체</option>
          <option value="TITLE">제목</option>
          <option value="CONTENT">내용</option>
          <option value="TITLE_OR_CONTENT">제목+내용</option>
          <option value="AUTHOR">작성자</option>
        </Select>
        <InputGroup>
          <Input
            value={inputs.query}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, query: e.target.value }))
            }
            name="query"
            placeholder="검색"
            rounded="full"
            color={color}
          />
          <Tooltip label="검색">
            <InputRightElement>
              <Button
                type="submit"
                variant="ghost"
                _hover={{ bgColor: "transparent" }}
              >
                <Icon as={BsSearch} />
              </Button>
            </InputRightElement>
          </Tooltip>
        </InputGroup>
      </Flex>
    </form>
  );
};
