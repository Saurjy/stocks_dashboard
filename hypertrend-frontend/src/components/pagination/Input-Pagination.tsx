import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

type InputPaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function InputPagination({
    currentPage,
    totalPages,
    onPageChange,
}: InputPaginationProps) {
    const [pageInput, setPageInput] = useState(currentPage)

    useEffect(() => {
        setPageInput(currentPage)
    }, [currentPage])

    if (totalPages <= 1) return null

    return (
        <Pagination>
            <PaginationContent >
                {/* Previous */}
                <PaginationItem className="rounded-md border bg-card border-border text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <PaginationPrevious
                        onClick={() =>
                            onPageChange(Math.max(currentPage - 1, 1))
                        }
                        aria-disabled={currentPage <= 1}
                        className={
                            currentPage === 1 ? "pointer-events-none opacity-50 border" : "rounded-md border"
                        }
                    />
                </PaginationItem>

                {/* Page Input */}
                <Input
                    id="page_input"
                    value={pageInput}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="bg-background w-15 text-center"
                    onChange={(e) => {
                        setPageInput(Number(e.target.value))
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const value = Number(e.currentTarget.value)
                            if (
                                !Number.isNaN(value) &&
                                value >= 1 &&
                                value <= totalPages &&
                                value !== currentPage
                            ) {
                                onPageChange(value)
                            } else {
                                // revert invalid input
                                setPageInput(currentPage)
                            }
                        }
                    }}
                />

                {/* Next */}
                <PaginationItem className="rounded-md border bg-card border-border text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <PaginationNext
                        onClick={() =>
                            onPageChange(Math.min(currentPage + 1, totalPages))
                        }
                        aria-disabled={currentPage === totalPages}
                        className={
                            currentPage >= totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}