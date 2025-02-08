// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "menu-items";
import NavItem from "./NavItem";
import Cookies from "js-cookie";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userType = user?.userTypeId; // 1 = Student, 2 = Admin, 3 = Teacher
  const userFullName = user?.userFullName;
  console.log("user:", user);

  // Define access permissions for each role
  const allowedMenus = {
    1: ["dashboard", "resultManagement"], // Student
    2: [
      "dashboard",
      "studentManagement",
      "teacherManagement",
      "courseManagement",
      "teacher-courseManagement",
      "resultManagement",
      "user",
    ], // Admin
    3: ["dashboard", "teacher-courseManagement", "resultManagement"], // Teacher
  };

  // Filter menu items based on allowedMenus
  const filteredMenuItems = menuItem.items.filter((item) =>
    allowedMenus[userType]?.includes(item.id)
  );

  const navItems = filteredMenuItems.map((item) => {
    switch (item.type) {
      case "item":
        return <NavItem key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <div>
      {/* Display the user role text for Admin */}
      {userType === 2 && (
        <Typography
          variant="h5"
          align="center"
          color="black"
          sx={{ mb: 2, fontFamily: "cursive" }}
        >
          Welcome, {userFullName}!
        </Typography>
      )}
      {/* Display the user role text for Teacher */}
      {userType === 3 && (
        <Typography
          variant="h5"
          align="center"
          color="black"
          sx={{ mb: 2, fontFamily: "cursive" }}
        >
          Welcome, {userFullName}!
        </Typography>
      )}
      {/* Display the user role text for Student */}
      {userType === 1 && (
        <Typography
          variant="h5"
          align="center"
          color="black"
          sx={{ mb: 2, fontFamily: "cursive" }}
        >
          Welcome, {userFullName}!
        </Typography>
      )}

      {/* Render filtered menu items */}
      {navItems}
    </div>
  );
};

export default MenuList;
