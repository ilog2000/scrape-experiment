import { useState } from 'react'
import { AdGrid } from '../AdGrid/AdGrid'
import { Pagination, Space } from '@mantine/core'

export function PagedAdGrid() {
  const [page, setPage] = useState(1)

  return (
    <>
      <AdGrid pageNr={page - 1} />
      <Space h="sm" />
      <Pagination value={page} onChange={setPage} total={10} />
    </>
  )
}
