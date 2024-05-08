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
import axios from 'axios';
import { useSelector } from 'react-redux';

function createData(id, name, phone, stage, score, activity, activity_date, owner, modifiedDate, date, source, property, email, crt, cnt) {
    return { id, name, phone, stage, score, activity, activity_date, owner, modifiedDate, date, source, property, email, crt, cnt };
}
const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Employee',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Team',
    },
    {
        id: 'stage',
        numeric: false,
        disablePadding: false,
        label: 'FOS',
    },
    {
        id: 'score',
        numeric: false,
        disablePadding: false,
        label: 'Crt deals',
    },
    {
        id: 'activity',
        numeric: false,
        disablePadding: false,
        label: 'Cnt deals',
    },
    {
        id: 'activity_date',
        numeric: false,
        disablePadding: false,
        label: 'D/FOS',
    },
    {
        id: 'owner',
        numeric: false,
        disablePadding: false,
        label: 'Crt Act %',
    },
    {
        id: 'modifiedDate',
        numeric: true,
        disablePadding: false,
        label: 'Cnt Act %',
    },
    {
        id: 'date',
        numeric: true,
        disablePadding: false,
        label: '% Achu',
    },
    {
        id: 'source',
        numeric: false,
        disablePadding: false,
        label: 'crt GTV',
    },
    {
        id: 'property',
        numeric: false,
        disablePadding: false,
        label: 'GTV',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Invoiced Deals',
    },
    {
        id: 'crt',
        numeric: false,
        disablePadding: false,
        label: 'NR crt',
    },
    {
        id: 'cnt',
        numeric: false,
        disablePadding: false,
        label: 'NR cnt',
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
        <TableHead className='bg-[#E5F2FC] w-full'>
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


export default function PerformanceTable() {
    // const Navigate = useNavigate();
    const [selectedColumns, setSelectedColumns] = useState(["name", "phone", "stage", "score", "activity", "activity_date", "owner", "modifiedDate", "date", 'source', "property", "email"]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [selectedFull, setSelectedFull] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [rows, setRows] = useState([]); // State to hold the rows of the table
    const [fetchData, setFetchData] = useState(false);
    const jwtToken = useSelector((state) => state.authentication.jwtToken);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leads`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                const dataFromBackend = response.data;
                const formattedRows = dataFromBackend.map(item =>
                    // function createData(id, phone, stage, score, activity, activity_date, owner, modifiedDate, date, source, property, email) {
                    createData(
                        item._id,
                        item.name,
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
                        '-',
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
            setSelectedFull(rows);
            return;
        }
        setSelected([]);
        setSelectedFull([])
    };

    const handleClick = (event, row) => {
        const selectedIndex = selected.indexOf(row.id);
        let newSelected = [];
        let newSelectedtemp = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row.id);
            newSelectedtemp = newSelectedtemp.concat(selectedFull, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newSelectedtemp = newSelectedtemp.concat(selectedFull.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newSelectedtemp = newSelectedtemp.concat(selectedFull.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            newSelectedtemp = newSelectedtemp.concat(
                selectedFull.slice(0, selectedIndex),
                selectedFull.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        setSelectedFull(newSelectedtemp);
        //setSelectedFull
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

    return (
        // <div>
        <Box sx={{ width: "auto" }} className="m-[10px] md:m-[10px] mt-[20px]">
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
                                                onClick={(event) => handleClick(event, row)}
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
                                                    case 'phone':
                                                        return <TableCell key={column.id} align="left">{row.phone}</TableCell>;
                                                    case 'stage':
                                                        return <TableCell key={column.id} align="left">{row.stage}</TableCell>;
                                                    case 'score':
                                                        return <TableCell key={column.id} align="left">{row.score}</TableCell>;
                                                    case 'activity':
                                                        return <TableCell key={column.id} align="left">{row.activity}</TableCell>;
                                                    case 'activity_date':
                                                        return <TableCell key={column.id} align="left">{row.activity_date}</TableCell>;
                                                    case 'owner':
                                                        return <TableCell key={column.id} align="left">{row.owner}</TableCell>;
                                                    case 'modifiedDate':
                                                        return <TableCell key={column.id} align="left">{row.modifiedDate}</TableCell>;
                                                    case 'date':
                                                        return <TableCell key={column.id} align="left">{row.date}</TableCell>;
                                                    case 'source':
                                                        return <TableCell key={column.id} align="left">{row.source}</TableCell>;
                                                    case 'property':
                                                        return <TableCell key={column.id} align="left">{row.property}</TableCell>;
                                                    case 'email':
                                                        return <TableCell key={column.id} align="left">{row.email}</TableCell>;
                                                    case 'crt':
                                                        return <TableCell key={column.id} align="left">{row.crt}</TableCell>;
                                                    case 'cnt':
                                                        return <TableCell key={column.id} align="left">{row.cnt}</TableCell>;
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
        </Box>
        // </div>
    );
}
