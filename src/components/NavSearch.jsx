"use client";

import { Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function NavSearch() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (value) => {
        setSearchTerm(value);
        router.push(`/search?search=${value}`);
    };

    return (
        <div>
            <Input.Search
                size='large'
                placeholder="Search Your Product"
                enterButton={
                    <Button 
                        type='dashed' 
                        style={{ backgroundColor: '#F9A8D4', borderColor: '#F9A8D4', color: '#fff' }}>
                        Search
                    </Button>
                }
                style={{ width: '100%' }}
                onSearch={handleSearch} // Perform search and navigate
            />
        </div>
    );
}
