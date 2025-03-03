'use client'
import React from 'react'

interface HelloProps {

}

const Hello: React.FC<HelloProps> = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">Hola Mundo desde NEXTJS</h1>
        </div>
    );
}

export default Hello;