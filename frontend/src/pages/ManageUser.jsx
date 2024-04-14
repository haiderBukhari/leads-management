import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
// import { Link, useNavigate } from "react-router-dom"
import { Input } from '@mui/material';
import RoleSelectionDialog from '../components/UserType';

function createData(id, name, email, phone, qualification, address, document) {
    return { id, name, email, phone, qualification, address, document };
}
const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Full Name',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Contact Number',
    },
    {
        id: 'address',
        numeric: true,
        disablePadding: false,
        label: 'Address',
    },
    {
        id: 'qualification',
        numeric: true,
        disablePadding: false,
        label: 'Qualification',
    },
    {
        id: 'document',
        numeric: true,
        disablePadding: false,
        label: 'Document',
    },
];

// Define a mapping of source names to background colors
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
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

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

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns, selectedColumns } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead className='bg-gray-200'>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {columns.map((column) => {
                    if (selectedColumns.includes(column.id)) {
                        return (
                            <TableCell
                                key={column.id}
                                className="font-semibold"
                                align={column.numeric ? 'right' : 'left'}
                                padding={column.disablePadding ? 'none' : 'normal'}
                                sortDirection={orderBy === column.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={orderBy === column.id ? order : 'asc'}
                                    onClick={createSortHandler(column.id)}
                                >
                                    {column.label}
                                    {orderBy === column.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        );
                    } else {
                        return null;
                    }
                })}
            </TableRow>
        </TableHead>
    );
}


EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            numeric: PropTypes.bool.isRequired,
            disablePadding: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectedColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default function ManageUser() {
    // const Navigate = useNavigate();
    const [selectedColumns, setSelectedColumns] = useState(['name', 'email', 'phone', 'address', 'qualification', 'document']);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [rows, setRows] = useState([]); // State to hold the rows of the table
    const [fetchData, setFetchData] = useState(false);
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState("unassigned");
    const [type, setType] = useState("all");

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/register/employee?type=${type}&role=${role}`)
            .then(response => {
                const dataFromBackend = response.data;
                const formattedRows = dataFromBackend.map(item =>
                    createData(
                        item._id,
                        item.name,
                        item.email,
                        item.contactNumber,
                        item.qualification,
                        item.address,
                        item.file
                    )
                );
                setRows(formattedRows);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [fetchData]);

    const AssignRole = (roleType) => {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register/role?role=${roleType}`, { users: selected })
            .then(() => {
                setFetchData(!fetchData);
                setSelected([])
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
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
                selected.slice(selectedIndex + 1),
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
    const isSelected = (id) => selected.indexOf(id) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const visibleRows = stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const handleColumnSelectChange = (event) => {
        const { value } = event.target;
        setSelectedColumns(value);
    };


    return (
        // <div>
        <Box sx={{ width: "auto" }} className="m-[20px] md:m-[40px]">
            <h1 className="text-2xl mb-3">Manage Users</h1>
            <hr />
            <div className='flex justify-between flex-wrap items-center'>
                <div className='mt-4 h-[40px] border-b-2 border-gray-300 flex items-start'>
                    <input type='text' placeholder='Search Lead' className='border-gray-300 pl-3' style={{ border: "1px solid #ccc" }} />
                    <SearchIcon className="bg-gray-300 text-gray-700 p-1" />
                </div>
                <div className='flex items-center'>
                    <div className='mt-4 h-[40px] border-b-2 border-gray-300 flex items-start'>
                        <FormControl style={{ maxWidth: '400px' }}>
                            <Select
                                multiple
                                value={selectedColumns}
                                onChange={handleColumnSelectChange}
                                input={<Input />} // You can use any input component here, like Input from '@mui/material'
                                style={{ minWidth: 200 }}
                            >
                                {headCells.map((column) => (
                                    <MenuItem key={column.id} value={column.id}>
                                        {column.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <select onChange={(e) => {
                        setOpen(true);
                        e.target.value = "";
                    }} className='bg-gray-200 px-2 h-[40px] outline-none'>
                        <option value=''>Activity</option>
                        <option value=''>Assign Role</option>
                        <option value=''>Change Role</option>
                    </select>
                </div>
            </div>
            <div className='min-h-[40px] bg-gray-200 border-b-2 border-gray-300 flex justify-center md:justify-start flex-wrap md:flex-nowrap items-center px-4 py-5 md:py-3 text-sm text-gray-700'>
                <div className='flex'>
                    <p className='mr-2'>Status</p>
                    <select onClick={(e) => {
                        setRole(e.target.value);
                        setFetchData(!fetchData);
                    }} className='outline-none cursor-pointer rounded-none'>
                        <option value='all' key=''>All</option>
                        <option value='assigned' key=''>Role Assigned</option>
                        <option value='unassigned' key='' selected>Role Unassigned</option>
                    </select>
                </div>
                <div className='flex mt-4 md:ml-4 md:mt-0'>
                    <p className='mr-2'>Type</p>
                    <select onClick={(e) => {
                        setType(e.target.value);
                        setFetchData(!fetchData);
                    }} className='outline-none cursor-pointer rounded-none'>
                        <option value='all' key=''>All</option>
                        <option value='generalManager' key=''>General Manager</option>
                        <option value='manager' key=''>Manager</option>
                        <option value='employee' key=''>Employees</option>
                    </select>
                </div>
            </div>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            columns={headCells}
                            selectedColumns={selectedColumns}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
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
                                        sx={{ cursor: 'default' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                onClick={(event) => handleClick(event, row.id)}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        {headCells.map((column) => {
                                            if (selectedColumns.includes(column.id)) {
                                                switch (column.id) {
                                                    case 'name':
                                                        return (
                                                            <TableCell
                                                                key={column.id}
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none"
                                                            >
                                                                {row.name}
                                                            </TableCell>
                                                        );
                                                    case 'email':
                                                        return <TableCell key={column.id} align="left">{row.email}</TableCell>;
                                                    case 'phone':
                                                        return (
                                                            <TableCell
                                                                key={column.id}
                                                                align="left"
                                                                sx={{ fontWeight: "bold", lineHeight: '0.43' }}
                                                                className='h-[20px]'
                                                            >
                                                                {row.phone}
                                                            </TableCell>
                                                        );
                                                    case 'address':
                                                        return <TableCell key={column.id} align="right">{row.address}</TableCell>;
                                                    case 'qualification':
                                                        return <TableCell key={column.id} align="right">{row.qualification}</TableCell>;
                                                    case 'document':
                                                        return (
                                                            <TableCell key={column.id} align="right">
                                                                <a
                                                                    style={{ color: "red", textDecoration: "underline", textDecorationThickness: "1px", cursor: "pointer" }}
                                                                    className='text-red-800'
                                                                    href={`${import.meta.env.VITE_BACKEND_URL}/files/${row.document}`}
                                                                    target='_blank'
                                                                >
                                                                    Download
                                                                </a>
                                                            </TableCell>
                                                        );
                                                    default:
                                                        return null;
                                                }
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 1 * emptyRows,
                                    }}
                                >
                                    {selectedColumns.map((columnId) => (
                                        <TableCell key={columnId} />
                                    ))}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 150]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <RoleSelectionDialog open={open} setOpen={setOpen} AssignRole={AssignRole} />
        </Box>
        // </div>
    );
}
