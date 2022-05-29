import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { visuallyHidden } from "@mui/utils";
import { Button, MenuItem, Modal, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  width: "auto",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Phone",
  },
  {
    id: "create_at",
    numeric: false,
    disablePadding: false,
    label: "Create At",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, selected, handleFilter, setLoading } = props;
  const [open, setOpen] = React.useState(false);
  const [listMajor, setListMajor] = React.useState([]);
  const employee = React.useRef({
    name: "",
    email: "",
    address: "",
    phone: "",
    major: {},
  });
  const [major, setMajor] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    employee.current = {
      name: "",
      email: "",
      address: "",
      phone: "",
      major: {},
    };
  };

  React.useLayoutEffect(() => {
    let data = [];
    (async () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch("http://localhost:8080/api/v1/majors", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setListMajor(result);
        })
        .catch((error) => console.log("error", error));
    })();
  }, []);

  const handleDelete = React.useCallback(() => {
    (async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(selected);

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      setLoading?.(true);
      await fetch("http://localhost:8080/api/v1/employee/list", requestOptions)
        .then((response) => {
          if (response.status == 200) {
            console.log(response.status);
          }
        })
        .catch((error) => console.log("error", error));
      setLoading?.(false);
    })();
  }, [setLoading]);

  React.useEffect(() => {
    // employee.current = { ...employee.current, major: getMajor(0) };
  }, [major]);

  const getMajor = (id) => {
    let _major = null;
    listMajor.map((major) => {
      if (major.id == id) {
        _major = major;
      }
    });
    return _major;
  };

  const handleCreate = React.useCallback(
    (e) => {
      e.preventDefault();
      const { name, email, address, phone, major } = employee.current;

      if (
        name == "" ||
        email == "" ||
        address == "" ||
        phone == "" ||
        major == {}
      ) {
        return;
      }

      (async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(employee.current);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        setLoading?.(true);
        await fetch("http://localhost:8080/api/v1/employee", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result?.status == 400) {
              console.log("400", result);
            }
            if (result?.status == 500) {
              console.log("500", result);
            } else {              
              handleClose();
            }
          })
          .catch((error) => console.log("error", error));
        setLoading?.(false);
      })();
      // },[setLoading]);
    },
    [setLoading]
  );

  const handleChangeSelectFilter = React.useCallback(
    (e) => {
      setMajor(e.target.value);
      handleFilter?.(e.target.value);
    },
    [handleFilter, major]
  );

  const handleChangeSelect = React.useCallback((e) => {
    setMajor(e.target.value);
    employee.current = { ...employee.current, major: getMajor(e.target.value) };
  }, []);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create new Employee
          </Typography>
          <hr />
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { marginBottom: 2, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required={true}
                label="Name"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    name: e.target.value,
                  };
                }}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Email"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    email: e.target.value,
                  };
                }}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Address"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    address: e.target.value,
                  };
                }}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Phone"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    phone: e.target.value,
                  };
                }}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Major"
                select
                value={major}
                onChange={handleChangeSelect}
              >
                {listMajor.map((option, index) => {
                  return (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <hr />
            <Button
              variant="contained"
              color="success"
              style={{ margin: 5 }}
              onClick={handleCreate}
            >
              Create
            </Button>
            <Button
              variant="contained"
              color="warning"
              style={{ margin: 5 }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Manager Employee
        </Typography>
      )}
      <Tooltip title="Filter">
        <TextField
          select
          value={major}
          onChange={handleChangeSelectFilter}
          sx={{ width: "200px" }}
        >
          <MenuItem value={0}>ALL</MenuItem>
          {listMajor.map((option, index) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            );
          })}
        </TextField>
      </Tooltip>
      <Tooltip title="Create Employee">
        <Button
          variant="contained"
          color="success"
          style={{
            whiteSpace: "nowrap",
            padding: "10px 30px",
            margin: "auto 10px",
            minWidth:"200px"
          }}
          onClick={handleOpen}
        >
          <AddIcon color="" />
          Add New Employee
        </Button>
      </Tooltip>
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <Button
            variant="contained"
            color="error"
            style={{
              whiteSpace: "nowrap",
              padding: "10px 30px",
              margin: "auto 10px",
            }}
            onClick={handleDelete}
          >
            <DeleteIcon />
            Delete
          </Button>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.any.isRequired,
};

export default function App() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [tempId, setTempId] = React.useState();
  const [major, setMajor] = React.useState(1);
  const [listMajor, setListMajor] = React.useState([]);
  const [name, setName] = React.useState(" ");
  const [email, setEmail] = React.useState(" ");
  const [address, setAddress] = React.useState(" ");
  const [phone, setPhone] = React.useState(" ");
  const employee = React.useRef({
    name: "",
    email: "",
    address: "",
    phone: "",
    major: {},
  });

  const handleOpen = (id) => {
    (async () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch("http://localhost:8080/api/v1/employee?id=" + id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result) {
            employee.current = result;
            setName(result.name);
            setEmail(result.email);
            setAddress(result.address);
            setPhone(result.phone);
            setMajor(result.major.id);
            console.log(result.major);
          }
        })
        .catch((error) => console.log("error", error));
    })();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setName("");
    setEmail("");
    setAddress("");
    setPhone("");
    setMajor("");
    employee.current = {
      name: "",
      email: "",
      address: "",
      phone: "",
      major: {},
    };
  };

  const handleChangeSelect = (e) => {
    setMajor(e.target.value);
    employee.current = { ...employee.current, major: getMajor(e.target.value) };
  };

  React.useEffect(() => {
    (async () => {
      const data = [];
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      // setLoading(true);
      await fetch("http://localhost:8080/api/v1/employees", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          result.map((item) => {
            const row = {
              id: item.id,
              name: item.name,
              email: item.email,
              address: item.address,
              phone: item.phone,
              create_at:formatDate(item.create_at)
            };            
            data.push(row);
          });
        })
        .catch((error) => console.log("error", error));

      setRows(data);
      // setLoading(false);
    })();
  }, [loading]);

  React.useEffect(() => {
    (async () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      await fetch("http://localhost:8080/api/v1/majors", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setListMajor(result);
        })
        .catch((error) => console.log("error", error));
    })();
  }, []);
  React.useEffect(() => {
    // employee.current = { ...employee.current, major: getMajor(0) };
  }, [major]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = React.useCallback((id) => {
    const data = [];
    (async () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      let condition = "/major?id=" + id;
      if (id == 0) condition = "";
      setLoading(true);
      await fetch(
        "http://localhost:8080/api/v1/employees" + condition,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          result.map((item) => {
            const row = {
              id: item.id,
              name: item.name,
              email: item.email,
              address: item.address,
              phone: item.phone,
              create_at:formatDate(item.create_at)
            };
            data.push(row);
          });
        })
        .catch((error) => console.log("error", error));
      setRows(data);
      setLoading(false);
    })();
  }, []);

  const handleOpenConfirm = (id) => {
    setOpenConfirm(true);
    setTempId(id);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setTempId("");
  };
  const getMajor = (id) => {
    let _major = null;
    listMajor.map((major) => {
      if (major.id == id) {
        _major = major;
      }
    });
    return _major;
  };

  const actionEmployee = (e) => {
    (async () => {
      setLoading(true);
      if (tempId == "") {
        e.preventDefault();
        const { name, email, address, phone, major } = employee.current;

        if (
          name == "" ||
          email == "" ||
          address == "" ||
          phone == "" ||
          major == {}
        ) {
          handleCloseConfirm();
          return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(employee.current);

        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        await fetch("http://localhost:8080/api/v1/employee", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            handleCloseConfirm();
            if (result) {              
              handleClose();
            }
          })
          .catch((error) => console.log("error", error));
        return;
      }

      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      await fetch(
        "http://localhost:8080/api/v1/employee?id=" + tempId,
        requestOptions
      )
        .then((response) => {
          if (response.status == 200) {
            handleCloseConfirm();
          }
        })
        .catch((error) => console.log("error", error));
      setLoading(false);
    })();
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Modal open={openConfirm} onClose={handleCloseConfirm}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm
          </Typography>
          <Button
            variant="contained"
            color="success"
            style={{ margin: 5 }}
            onClick={actionEmployee}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="warning"
            style={{ margin: 5 }}
            onClick={handleCloseConfirm}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Employee
          </Typography>
          <hr />
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { marginBottom: 2, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required={true}
                label="Name"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    name: e.target.value,
                  };
                  setName(e.target.value);
                }}
                value={name}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Email"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    email: e.target.value,
                  };
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Address"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    address: e.target.value,
                  };
                  setAddress(e.target.value);
                }}
                value={address}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Phone"
                onChange={(e) => {
                  employee.current = {
                    ...employee.current,
                    phone: e.target.value,
                  };
                  setPhone(e.target.value);
                }}
                value={phone}
              />
            </div>
            <div>
              <TextField
                required={true}
                label="Major"
                select
                value={major}
                onChange={handleChangeSelect}
              >
                {listMajor.map((option, index) => {
                  return (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <hr />
            <Button
              variant="contained"
              color="success"
              style={{ margin: 5 }}
              onClick={() => handleOpenConfirm("")}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="warning"
              style={{ margin: 5 }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
            rows={rows}
            handleFilter={(id) => handleFilter(id)}
            setLoading={(e) => setLoading(e)}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                            onClick={(event) => handleClick(event, row.id)}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          onClick={(event) => handleClick(event, row.id)}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={(event) => handleClick(event, row.id)}
                        >
                          {row.email}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={(event) => handleClick(event, row.id)}
                        >
                          {row.address}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={(event) => handleClick(event, row.id)}
                        >
                          {row.phone}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={(event) => handleClick(event, row.id)}
                        >
                          {row.create_at}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={(e) => {
                                handleOpenConfirm(row.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(e) => {
                                handleOpen(row.id);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
}

export const formatDate = (date) => {
  let d = new Date(date);
  var dd = d.getDate();
  var mm = d.getMonth() + 1; //January is 0!
  var yyyy = d.getFullYear();
  d = mm + '/' + dd + '/' + yyyy;
  return d;
};
