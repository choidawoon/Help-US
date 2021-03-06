import { FC, useState, useEffect, FormEvent } from "react";

import { getCSList } from "function/axios";
import Pagination from "@/components/Pagination";
import {
  Box,
  Grid,
  Tab,
  Typography,
  Stack,
  Button,
  InputBase,
  Paper,
  Tabs,
  Link,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material/";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material/";
import { tableCellClasses } from "@mui/material/TableCell";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import volunteer1 from "../public/images/volunteer1.jpg";
import { locale } from "dayjs";
import CarouselMain from "../components/CarouselMain";

const CustomButton = styled(Button)({
  backgroundColor: "#5B321E",
  color: "white",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#CDAD78",
    color: "white",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CDAD78",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
    backgroundColor: "#FCF8F0",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  height: 62,
}));

const CsMain: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [csList, setCSList] = useState<any>(null);
  const [option, setOption] = useState("전체");

  const [word, setWord] = useState("");
  // pagination
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const paginate = (pageNumber) => setCurPage(pageNumber);
  const [myId, setMyId] = useState(0);
  const [myRole, setMyRole] = useState("");

  const onClickVisible = () => {
    alert("비공개 게시글 입니다.");
    return;
  };

  const params = {
    page: curPage,
    category: null,
    word: null,
  };
  const Search = (e: FormEvent) => {
    e.preventDefault();
    console.log("option : " + option);
    console.log("word : " + word);
    if (option === "전체") params.category = null;
    else params.category = option;
    if (word === "") params.word = null;
    else params.word = word;
    setLoading(false);
    getCSList(params).then((res) => {
      // console.log(res);
      setCSList(res.data.desk);
      setTotalPages(res.data.totalPage);
      // console.log("data는", reviewList);
      setLoading(true);
    });
  };
  const optionHandleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
    if (event.target.value === "전체") params.category = null;
    else params.category = event.target.value;
    if (word === "") params.word = null;
    // console.log(event.target.value);
    setLoading(false);
    getCSList(params).then((res) => {
      // console.log(res.data);
      setCSList(res.data.desk);
      setTotalPages(res.data.totalPage);
      // console.log("data는", reviewList);
      setLoading(true);
    });
  };

  useEffect(() => {
    setMyId(Number(localStorage.getItem("id")));
    setMyRole(localStorage.getItem("role"));

    getCSList(params).then((res) => {
      // console.log(res);
      setCSList(res.data.desk);
      // console.log(res.data);
      setTotalPages(res.data.totalPage);
      // console.log("data는", reviewList);
      setLoading(true);
    });
  }, [curPage]);

  const Unix_timestamp = (t) => {
    var date = new Date(t);
    date.setHours(date.getHours() + 9);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    return (
      year +
      "-" +
      month.substr(-2) +
      "-" +
      day.substr(-2) +
      " " +
      hour.substr(-2) +
      ":" +
      minute.substr(-2)
    );
  };

  return (
    <div>
      {loading ? (
        <Grid container justifyContent="center" alignItems="center">
          <Stack>
            <Box textAlign="center">
              {/* 이미지 출력 부분 */}
              <Stack alignItems="center" sx={{ mb: 5 }}>
                <CarouselMain />
              </Stack>
            </Box>
            <Box sx={{ fontWeight: "bold", mt: 5 }}>
              <Typography variant="h4" textAlign="center">
                문의 게시판
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {myRole === "USER" || myRole === "ORG" ? (
                <CustomButton variant="contained" href="create/cs">
                  글 작성
                </CustomButton>
              ) : (
                <></>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Box
                sx={{
                  minWidth: 200,
                  display: "flex",
                  justifyContent: "flex-end",
                  mr: 6,
                }}
              >
                <FormControl>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    value={option}
                    label="option"
                    onChange={optionHandleChange}
                    defaultValue={option}
                  >
                    <MenuItem value="전체">전체</MenuItem>
                    <MenuItem value="문의">문의</MenuItem>
                    <MenuItem value="정보수정">정보수정</MenuItem>
                    <MenuItem value="신고">신고</MenuItem>
                    <MenuItem value="도움">도움</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 250,
                }}
                onSubmit={Search}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="검색"
                  onChange={(event) => {
                    //adding the onChange event
                    setWord(event.target.value);
                  }}
                />
                <IconButton type="submit" sx={{ p: "10px" }} onClick={Search}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
            <Stack>
              <TableContainer component={Paper} sx={{ my: 5 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        카테고리
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        제목
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        공개 여부
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        답변 여부
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        작성일
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {csList &&
                      csList.map((data, i) => (
                        <StyledTableRow key={i}>
                          <StyledTableCell align="center">
                            {data?.category}
                          </StyledTableCell>

                          {myRole !== "ADMIN" &&
                          data?.visible === "비공개" &&
                          data?.memberId !== myId ? (
                            <StyledTableCell
                              align="center"
                              sx={{ width: 400 }}
                              onClick={onClickVisible}
                            >
                              {data?.title}
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell align="center" sx={{ width: 400 }}>
                              <Link
                                href={`/detail/cs/${data?.helpDeskId}`}
                                underline="none"
                                color="inherit"
                              >
                                {data.title}
                              </Link>
                            </StyledTableCell>
                          )}

                          <StyledTableCell align="center">
                            {data?.visible}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {data?.status}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {Unix_timestamp(data?.createDate)}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
            {csList && csList.length > 0 ? (
              <Stack alignItems="center" sx={{ mb: 5 }}>
                <Pagination
                  curPage={curPage}
                  paginate={paginate}
                  totalPage={totalPages}
                />
              </Stack>
            ) : (
              <></>
            )}
          </Stack>
        </Grid>
      ) : null}
    </div>
  );
};

export default CsMain;
