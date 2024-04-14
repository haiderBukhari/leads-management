import React, { useEffect } from 'react';
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
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import UploadLeadsDialog from './UploadDialog';
import AssignLeadsDialog from './AssignLead';

function createData(id, name, email, source, phone, date) {
    return {
        id,
        name,
        email,
        source,
        phone,
        date
    };
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
        id: 'source',
        numeric: false,
        disablePadding: false,
        label: 'Source',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Phone',
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Assigned Date',
    },
];

// Define a mapping of source names to background colors
const sourceColors = {
    'Source A': '#9C27B0', // Example color for Source A
    'Source B': '#E57373', // Example color for Source B
    'Source C': '#4CAF50', // Example color for Source C
    'Source D': '#64B5F6', // Example color for Source D
    'Source E': '#EF9A9A', // Example color for Source E
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
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
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
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={headCell.id + index*1009272 + 28287}
                        className="font-semibold"
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ open, setOpen }) {
    const Navigate = useNavigate();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [rows, setRows] = React.useState([]); // State to hold the rows of the table
    const [open1, setOpen1] = React.useState(false);
    const [fetchData, setFetchData] = React.useState(false);

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
    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leads`)
            .then(response => {
                const dataFromBackend = response.data;
                console.log(dataFromBackend)
                const formattedRows = dataFromBackend.map(item =>
                    createData(
                        item._id,
                        item.name,
                        item.email,
                        item.source,
                        item.phone,
                        item.createdAt,
                    )
                );
                setRows(formattedRows);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [fetchData]);


    return (
        <Box sx={{ width: "1200px", marginLeft: "10px" }}>
            <div className="flex justify-between mb-3">
                <div className='h-[40px] border-gray-300 flex items-start'>
                    <input type='text' placeholder='Search Lead' className='border-gray-300 pl-3' style={{ border: "1px solid #ccc" }} />
                    <SearchIcon className="bg-gray-300 text-gray-700 p-1" />
                </div>
                <select onChange={(e) => {
                    setOpen1(true);
                    e.target.value = "";
                }} className='bg-gray-200 px-2 h-[40px] outline-none'>
                    <option value=''>Activity</option>
                    <option value=''>Change Owner</option>
                    <option value=''>Reset All Filters</option>
                </select>

            </div>

            <div className='min-h-[40px] bg-gray-200 border-b-2 border-gray-300 flex items-center px-4 py-2 text-sm text-gray-700 justify-between'>
                <div className='flex'>
                    <p className='mr-2'>Lead Stage</p>
                    <select className='outline-none cursor-pointer rounded-none'>
                        <option value='' key=''>All</option>
                        <option value='' key=''>Assigned</option>
                        <option value='' key=''>Unassigned</option>
                    </select>
                </div>
                <div className='flex ml-4'>
                    <p className='mr-2'>Lead Source</p>
                    <select className='outline-none cursor-pointer rounded-none'>
                        <option value='' key=''>All</option>
                        <option value='' key=''>Source A</option>
                        <option value='' key=''>Source B</option>
                        <option value='' key=''>Source C</option>
                        <option value='' key=''>Source D</option>
                        <option value='' key=''>Source E</option>
                    </select>
                </div>
                <div className='flex ml-4'>
                    <p className='mr-2'>Owner</p>
                    <select className='outline-none cursor-pointer rounded-none'>
                        <option value='' key=''>Any</option>
                        <option value='' key=''>Owner A</option>
                        <option value='' key=''>Owner B</option>
                        <option value='' key=''>Owner C</option>
                        <option value='' key=''>Owner D</option>
                        <option value='' key=''>Owner E</option>
                    </select>
                </div>
                <div className='flex ml-4'>
                    <p className='mr-2'>Date Uploaded</p>
                    <input className='outline-none cursor-pointer rounded-none' type="date" />
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
                            className="cursor-default"
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows?.length}
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
                                        key={row.id + + index*100 + 287}
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
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            onClick={() => { Navigate(`/LeadManagement/${row.id}`) }}
                                            style={{ color: "red", textDecoration: "underline", textDecorationThickness: "1px", cursor: "pointer" }}
                                            className='text-red-800'
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">{row.email || '-'}</TableCell>
                                        <TableCell align="left" sx={{ lineHeight: '0.43' }} className='h-[20px]'>{row.source}</TableCell>
                                        <TableCell align="right">{row.phone}</TableCell>
                                        <TableCell align="right">{row?.date?.slice(0, 10)}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={9} />
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
            <UploadLeadsDialog fetchData={fetchData} setFetchData={setFetchData} open={open} setOpen={setOpen} />
            <AssignLeadsDialog fetchData={fetchData} setFetchData={setFetchData} open={open1} setOpen={setOpen1} selectedLeads={selected} />
        </Box>
    );
}
