import React from 'react'

export default function Skeleton() {
    return (
        <div className="mt-10 max-w-[1450px] min-h-[50vh] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
                <div key={idx} className="skeleton h-[260px] w-full rounded-sm" />
            ))}
        </div>

    )
}
