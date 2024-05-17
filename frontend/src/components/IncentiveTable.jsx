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
import { Input } from '@mui/material';
import RoleSelectionDialog from '../components/UserType';
import { failedToast, successToast } from '../utils/ToastsNotifications';
import AssignOwnerDialog from '../components/AssignOwner';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function createData(id, name, creationDate, creatorName, bspTotal, status) {
    return { id, name, creationDate, creatorName, bspTotal, status };
}

const headCells = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Lead Id' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Lead Name' },
    { id: 'creationDate', numeric: false, disablePadding: false, label: 'Creation Date' },
    { id: 'creatorName', numeric: false, disablePadding: false, label: 'Creator Name' },
    { id: 'bspTotal', numeric: false, disablePadding: false, label: 'BSP Total' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' }, // New column for Action button
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns, selectedColumns } = props;
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
                        inputProps={{ 'aria-label': 'select all desserts' }}
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

export default function IncentiveTable({filteration, fetchData, setFetchData, searchData, isAnd}) {
    const [selectedColumns, setSelectedColumns] = useState(['id', 'name', 'creationDate', 'creatorName', 'bspTotal', 'action']);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [ownerType, setOwnerType] = useState('');
    const jwtToken = useSelector((state) => state.authentication.jwtToken);
    const userDetails = useSelector((state) => state.authentication);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/deal?segment=${filteration.segment}&closureDate=${filteration.closureDate}&channel=${filteration.channel}&saleType=${filteration.saleType}&searchData=${JSON.stringify(searchData)}&logic=${isAnd ? 'and': 'or'}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                const dataFromBackend = response.data;
                const formattedRows = dataFromBackend.map(item =>
                    createData(
                        item._id,
                        item.name,
                        item.createdAt,
                        item.ownerName || '-',
                        item.propertyDetails.bspTotal || '-',
                        item.dealStatus || '-',
                    )
                );
                setRows(formattedRows);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [fetchData]);

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

    const handleClick = (event, row) => {
        const selectedIndex = selected.indexOf(row.id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row.id);
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
    const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleColumnSelectChange = (event) => {
        const { value } = event.target;
        setSelectedColumns(value);
    };

    return (
        <Box sx={{ width: "auto" }} className="m-[10px] md:m-[10px] mt-[20px]">
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
                                input={<Input />}
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
                        if (e.target.value === 'role') {
                            if (!selected.length) {
                                e.target.value = "";
                                return failedToast("Select Users to Change/Assign their Role");
                            }
                            setOpen(true);
                        } else if (e.target.value === 'owner') {
                            if (!selected.length) {
                                e.target.value = "";
                                return failedToast("Select Users to Change/Assign Owner");
                            }
                            const temprole = rows.find(row => row.id === selected[0]).role;
                            for (const id of selected) {
                                const userRole = rows.find(row => row.id === id).role;
                                if (!userDetails.isAdmin) {
                                    if (userRole === userDetails.isGeneralManager ? "General Manager" : userDetails.isManager ? 'Manager' : userDetails.isEmployee ? 'Employee' : '') {
                                        return failedToast(`You don't have permission to assign ${userRole}`);
                                    }
                                } else if (userRole !== temprole) {
                                    e.target.value = "";
                                    return failedToast("Select the users with the same role");
                                }
                            }
                            setOwnerType(temprole);
                            setOpen1(!open1);
                        }
                        e.target.value = "";
                    }} className='bg-gray-200 max-w-[140px] px-2 h-[40px] outline-none'>
                        <option value=''>Activity</option>
                        {
                            userDetails.isAdmin && <option value='role'>Assign/Change Role</option>
                        }
                        <option value='owner'>Assign/Change Owner</option>
                    </select>
                </div>
            </div>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
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
                                                onClick={(event) => handleClick(event, row)}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </TableCell>
                                        {headCells.map((column) => {
                                            if (selectedColumns.includes(column.id)) {
                                                switch (column.id) {
                                                    case 'id':
                                                        return (
                                                            <TableCell
                                                                key={column.id}
                                                                component="th"
                                                                id={labelId}
                                                                scope="row"
                                                                padding="none"
                                                            >
                                                                <Link to={`/deal/${row.id}`} className="text-red-700">
                                                                {row.id}
                                                                </Link>
                                                            </TableCell>
                                                        );
                                                    case 'name':
                                                        return <TableCell key={column.id}>{row.name}</TableCell>;
                                                    case 'creationDate':
                                                        return <TableCell key={column.id}>{row.creationDate.slice(0, 10)} {row.creationDate.slice(11, 16)}</TableCell>;
                                                    case 'creatorName':
                                                        return <TableCell key={column.id}>{row.creatorName}</TableCell>;
                                                    case 'bspTotal':
                                                        return <TableCell key={column.id}>{row.bspTotal}</TableCell>;
                                                            case 'action':
                                                        return <TableCell key={column.id}>{row.status}</TableCell>;
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
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
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
            <RoleSelectionDialog open={open} setOpen={setOpen} />
            <AssignOwnerDialog fetchData={fetchData} setFetchData={setFetchData} open={open1} setOpen={setOpen1} selectedLeads={selected} setSelected={setSelected} type={ownerType} />
        </Box>
    );
}