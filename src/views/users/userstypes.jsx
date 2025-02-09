import {
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  TablePagination,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";


import React, { useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";
import showToast from "ToastMessage/showToast";
import { getData } from "apiHandler/apiHandler";



const UserType = () => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ userTypeName: "" });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("userTypeName");

  

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getData("/userTypes");
      setUserTypes(res.data);
    } catch (err) {
      showToast("error", "Error fetching data!");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const alphabeticalComparator = (a, b) => {
    if (a.userTypeName < b.userTypeName) return -1;
    if (a.userTypeName > b.userTypeName) return 1;
    return 0;
  };

  const sortedUserTypes = [...userTypes].sort((a, b) => {
    if (orderBy === "userTypeName") {
      return order === "asc"
        ? alphabeticalComparator(a, b)
        : alphabeticalComparator(b, a);
    }
    return 0;
  });

  const filteredUserTypes = sortedUserTypes.filter((userType) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return userType.userTypeName.toLowerCase().includes(lowerCaseSearchTerm);
  });

  useEffect(() => {
    fetchData();
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      document.getElementById("searchInput").focus();
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "100%",
        padding: "15px",
        border: "2px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "13px",
          marginRight: "15px",
        }}
      >
        <div>
          <Typography
            style={{ marginLeft: "20px", marginTop: "10px" }}
            fontWeight="bold"
            variant="h3"
          >
            User Type Records
          </Typography>
          <div style={{ marginLeft: "20px", marginTop: "7px" }}>
            Total User Types: {userTypes.length}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{ position: "relative", marginRight: "40px", height: "0px" }}
          >
            <input
              id="searchInput"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                height: "35px",
                width: isExpanded ? "215px" : "0px",
                borderRadius: "10px",
                border: "1px solid gray",
                paddingLeft: "15px",
                transition: "width 0.3s ease, opacity 0.3s ease",
                opacity: isExpanded ? "1" : "0",
                paddingRight: "40px",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #1d396e",
                background: "#1d396e",
                padding: "5px",
                position: "absolute",
                right: "0px",
                top: "17px",
                transform: "translateY(-50%)",
                width: "36px",
                height: "35px",
                borderRadius: "10px",
                zIndex: 1,
              }}
            >
              <FaSearch
                onClick={toggleExpand}
                style={{
                  cursor: "pointer",
                  color: "white",
                  width: "15px",
                  height: "15px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <TableContainer
        sx={{ maxHeight: "59vh", minHeight: "410px", padding: "20px" }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ paddingLeft: "10px" }}>
                <TableSortLabel
                  active={orderBy === "userTypeName"}
                  direction={orderBy === "userTypeName" ? order : "asc"}
                  onClick={() => handleRequestSort("userTypeName")}
                >
                  Name
                  {orderBy === "userTypeName" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">User Type ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUserTypes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover key={row.userTypeId}>
                  <TableCell sx={{ paddingLeft: "10px" }}>
                    {row.userTypeName}
                  </TableCell>
                  <TableCell align="right" sx={{ paddingRight: "50px" }}>
                    {row.userTypeId}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredUserTypes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
    </Paper>
  );
};

export default UserType;
