import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {InputAdornment, IconButton, TextField, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import '../UserSearchStyles.css';
import UserTable from "./UserTable";


const perPage = 10;


const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const searchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${process.env.REACT_APP_GITHUB_URL}?q=${searchTerm}&sort=followers&page=${currentPage}&per_page=${perPage}`,
                {
                    headers: {
                        'Authorization': process.env.REACT_APP_GITHUB_TOKEN,
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                }
            );
            if (response.data.total_count === 0) {
                setSearchResults([]);
                setCurrentPage(1)
                setError('No users found for the given search term.');
            } else {
                const users = response.data.items;
                setSearchResults(users);
                setTotalPages(Math.ceil(response.data.total_count / perPage));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if(error.response){
                setError(error.response.data.message)
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            searchUsers();
        } else {
            setSearchResults([]);
            setError('Please enter a search term.');
        }
    }, [searchTerm, currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="container">
            <div className="header">
                <h1>GitHub User Search</h1>
            </div>
            <TextField
                className="inputField"
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => searchUsers()} disabled={searchTerm.trim() === ''}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <div className="tableContainer">
                <UserTable searchResults={searchResults} loading={loading} />
                {error && (
                    <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>{error}</div>
                )}

                {!loading && searchResults.length === 0 && !error && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>No users found for the given search term.</div>
                )}
                {!loading && searchResults.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </div>
                )}

            </div>
            {/* Copyright notice */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
                &copy; 2023. All rights reserved.
            </div>
        </div>
    );
};

export default UserSearch;
