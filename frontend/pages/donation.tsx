import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Grid,
  Tab,
  Typography,
  Stack,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Tabs,
  CssBaseline,
  Container,
} from "@mui/material/";
import { TabContext, TabList } from "@mui/lab/";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import DonationCard from "../components/DonationCard";
import VolunteerCard from "../components/VolunteerCard";
import volunteer1 from "../public/images/volunteer1.jpg";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import CarouselMain from "../components/CarouselMain";
// api
import { getDonationMain, getVolunteerMain } from "function/axios";
import { NineKOutlined } from "@mui/icons-material";

const CustomButton = styled(Button)({
  backgroundColor: "#5B321E",
  color: "white",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#CDAD78",
    color: "white",
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    // maxWidth: 40,
    width: 100,
    backgroundColor: "#CDAD78",
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: "#8a867e",
  "&.Mui-selected": {
    color: "#CDAD78",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const theme = createTheme({
  typography: {
    // fontFamily: "Gowun Dodum",
    // fontFamily: "Noto Serif KR",
    fontFamily: "Noto Sans KR",
  },
  palette: {
    primary: {
      main: "#5B321E",
    },
  },
});

const Donation: FC = () => {
  const router = useRouter();
  const [value, setValue] = useState<any>(0);
  const [option, setOption] = useState("?????????");

  // pagination
  const [curPage, setCurPage] = useState(1);
  const [curPage2, setCurPage2] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPages2, setTotalPages2] = useState(0);
  const paginate = (pageNumber) => setCurPage(pageNumber);
  const paginate2 = (pageNumber) => setCurPage2(pageNumber);

  const [userRole, setUserRole] = useState<any>("");

  // ?????????
  const [recentDonation, setRecentDonation] = useState<any>("");
  const [recentVolunteer, setRecentVolunteer] = useState<any>("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const optionHandleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  const params1 = {
    page: curPage,
    order: option,
  };

  const params2 = {
    page: curPage2,
    order: option,
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setUserRole(userRole);
    getDonationMain(params1).then((res) => {
      setRecentDonation(res.data.donation);
      setTotalPages(res.data.totalPage);
    });
    getVolunteerMain(params2).then((res) => {
      setRecentVolunteer(res.data.listVolunteer);
      setTotalPages2(res.data.totalPage);
    });
  }, [curPage, curPage2]);
  useEffect(() => {
    params1.order = option;
    params2.order = option;

    getDonationMain(params1).then((res) => {
      setRecentDonation(res.data.donation);
      setTotalPages(res.data.totalPage);
    });

    getVolunteerMain(params2).then((res) => {
      setRecentVolunteer(res.data.listVolunteer);
      setTotalPages2(res.data.totalPage);
    });
  }, [option]);

  // ??????????????? ?????????
  useEffect(() => {
    if (router.isReady){
      if(router.query.value){
        setValue(Number(router.query.value))
      }
    }
  },[router.isReady])
  
  return (
    <>
      <Container maxWidth="lg">
        <CssBaseline />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            mt: 0,
          }}
        >
          <Box textAlign="center">
            {/* ????????? ?????? ?????? */}
            <Stack alignItems="center" sx={{ mb: 5 }}>
              <CarouselMain />
            </Stack>
          </Box>
          <Stack>
            <Box sx={{ width: "100%", mt: 2 }}>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <StyledTabs
                    sx={{ ml: 7 }}
                    value={value}
                    onChange={handleChange}
                  >
                    <StyledTab
                      sx={{ fontWeight: "bold" }}
                      label="?????? ??????"
                      {...a11yProps(0)}
                    />
                    <StyledTab
                      sx={{ fontWeight: "bold" }}
                      label="??????"
                      {...a11yProps(1)}
                    />
                  </StyledTabs>
                  {userRole === "ORG" || userRole === "org" ? (
                    <Stack direction="row" alignItems="center" spacing={5}>
                      <Link href={"/create/donationorg"}>
                        <CustomButton sx={{ height: 40 }}>
                          ?????? ??????
                        </CustomButton>
                      </Link>
                      <Link href={"/create/volunteer"}>
                        <CustomButton sx={{ height: 40 }}>
                          ?????? ??????
                        </CustomButton>
                      </Link>
                    </Stack>
                  ) : null}
                  <Box
                    sx={{
                      minWidth: 200,
                      display: "flex",
                      justifyContent: "flex-end",
                      mr: 6,
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>??????</InputLabel>
                      <Select
                        value={option}
                        label="option"
                        onChange={optionHandleChange}
                      >
                        <MenuItem value="?????????">?????????</MenuItem>
                        <MenuItem value="?????????">????????? ?????? ???</MenuItem>
                        <MenuItem value="?????????">????????? ?????? ???</MenuItem>
                        <MenuItem value="????????????">????????? ???</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
                <TabPanel value={value} index={0}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, 300px)",
                      justifyContent: "center",
                      alignItems: "center",
                      rowGap: 5,
                      columnGap: 7,
                    }}
                  >
                    {recentDonation && recentDonation.length > 0 ? (
                      recentDonation.map((item, i) => (
                        <DonationCard donation={item} key={i} />
                      ))
                    ) : (
                      <Typography sx={{ margin: "200px 0" }}>
                        ?????? ?????? ???????????? ????????????.
                      </Typography>
                    )}
                  </Box>
                  {recentDonation && recentDonation.length > 0 ? (
                  <Stack alignItems="center" sx={{ mb: 2, mt: 5 }}>
                    <Pagination
                      curPage={curPage}
                      paginate={paginate}
                      totalPage={totalPages}
                    />
                    </Stack>
                  ) : (<></>
                    )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, 300px)",
                      justifyContent: "center",
                      alignItems: "center",
                      rowGap: 5,
                      columnGap: 7,
                    }}
                  >
                    {recentVolunteer && recentVolunteer.length > 0 ? (
                      recentVolunteer.map((item, i) => (
                        <VolunteerCard volunteer={item} key={i} />
                      ))
                    ) : (
                      <Typography sx={{ margin: "200px 0" }}>
                        ?????? ?????? ???????????? ????????????.
                      </Typography>
                    )}
                  </Box>
                  {recentVolunteer && recentVolunteer.length > 0 ? (
                  <Stack alignItems="center" sx={{ mb: 2, mt: 5 }}>
                    <Pagination
                      curPage={curPage2}
                      paginate={paginate2}
                      totalPage={totalPages2}
                    />
                    </Stack>
                  ) : (
                    <></>
                    )}
                </TabPanel>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default Donation;
