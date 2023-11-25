import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Avatar, CircularProgress } from '@mui/material';

const UserTable = ({ searchResults, loading }) => (
    <div style={{ height: '800px' }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Avatar</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={2} style={{ textAlign: 'center', marginTop: '20px' }}>
                            <CircularProgress />
                        </TableCell>
                    </TableRow>
                ) : (
                    searchResults.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.login}</TableCell>
                            <TableCell>
                                <Avatar alt={`${user.login}'s avatar`} src={user.avatar_url} sx={{ width: 50, height: 50 }} />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
);

export default UserTable;
