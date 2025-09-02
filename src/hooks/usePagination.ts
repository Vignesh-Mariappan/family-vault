import { useState, useMemo } from "react"

export function usePagination<T>(data: T[], pageSize: number = 10): {
  page: number
  setPage: (page: number) => void
  pageCount: number
  paginatedData: any[]
} {
  const [page, setPage] = useState(1)

  const pageCount = useMemo(() => Math.ceil(data.length / pageSize), [data, pageSize])

  const paginatedData = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize]
  )

  return {
    page,
    setPage,
    pageCount,
    paginatedData,
  }
}
