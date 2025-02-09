import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
import User1 from "assets/images/users/userIcon.png";

// assets
import {
  IconLogout,
  IconSettings,
  IconLetterFSmall,
  IconServicemark,
  IconDevicesQuestion,
  IconUserEdit,
} from "@tabler/icons-react";
import Cookies from "js-cookie";
import showToast from "toastMessage/showToast";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userType = user?.userTypeId; // 1 = Student, 2 = Admin, 3 = Teacher
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    Cookies.remove("user");
    navigate("/auth/login");
    showToast("success", "Successfully Logged Out");
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = "") => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== "") {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleFaculty = () => {
    navigate("/faculty");
  };
  const handleSemester = () => {
    navigate("/semester");
  };
  const handleExamType = () => {
    navigate("/examType");
  };
  const handleUserType = () => {
    navigate("/userType");
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light,
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: "8px 0 8px 8px !important",
              cursor: "pointer",
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={
          <IconSettings
            stroke={1.5}
            size="1.5rem"
            color={theme.palette.primary.main}
          />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ p: 2, pt: 0 }}>
                    <List
                      component="nav"
                      sx={{
                        width: "100%",
                        maxWidth: 350,
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "10px",
                        [theme.breakpoints.down("md")]: {
                          minWidth: "100%",
                        },
                        "& .MuiListItemButton-root": {
                          mt: 0.5,
                        },
                      }}
                    >
                      {/* Show these buttons only if the user is an Admin */}
                      {userType === 2 && (
                        <>
                          {/* Faculty Button */}
                          <ListItemButton
                            sx={{
                              borderRadius: `${customization.borderRadius}px`,
                            }}
                            selected={selectedIndex === 0}
                            onClick={() => handleFaculty()}
                          >
                            <ListItemIcon>
                              <IconLetterFSmall stroke={1.5} size="1.8rem" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">Faculty</Typography>
                              }
                            />
                          </ListItemButton>

                          {/* Semester Button */}
                          <ListItemButton
                            sx={{
                              borderRadius: `${customization.borderRadius}px`,
                            }}
                            selected={selectedIndex === 1}
                            onClick={() => handleSemester()}
                          >
                            <ListItemIcon>
                              <IconServicemark stroke={1.5} size="1.8rem" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  Semester
                                </Typography>
                              }
                            />
                          </ListItemButton>

                          {/* Exam Type Button */}
                          <ListItemButton
                            sx={{
                              borderRadius: `${customization.borderRadius}px`,
                            }}
                            selected={selectedIndex === 2}
                            onClick={() => handleExamType()}
                          >
                            <ListItemIcon>
                              <IconDevicesQuestion stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  Exam Type
                                </Typography>
                              }
                            />
                          </ListItemButton>

                          {/* User Type Button */}
                          <ListItemButton
                            sx={{
                              borderRadius: `${customization.borderRadius}px`,
                            }}
                            selected={selectedIndex === 3}
                            onClick={() => handleUserType()}
                          >
                            <ListItemIcon>
                              <IconUserEdit stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  User Type
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </>
                      )}

                      {/* Logout Button - Always Visible */}
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 4}
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">Logout</Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
