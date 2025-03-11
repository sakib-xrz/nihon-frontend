"use client"
import { Button, Input } from 'antd';
import React from 'react';

export default function NavSearch() {
    return (
        <div>
            <Input.Search
            size='large'
                placeholder="Search Your Product"
                enterButton={
                    <Button style={{ backgroundColor: '#F9A8D4', borderColor: '#F9A8D4', color: '#fff' }}>
                        Search
                    </Button>
                }
                style={{ width: '100%' }}
                onSearch={value => console.log(value)} // Replace this with your search logic
            />
        </div>
    );
}
