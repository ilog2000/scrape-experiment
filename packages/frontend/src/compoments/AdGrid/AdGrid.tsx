import { Badge, Button, Card, Group, Image, SimpleGrid, Text } from '@mantine/core'
import { useQuery } from 'react-query'
import { DbRecord } from '@scrape-experiment/shared/models'

export function AdGrid({ pageNr = 0 }: { pageNr?: number }) {
  const { data, isLoading, isError, error } = useQuery(`ads${pageNr}`, async () => {
    const url = `http://localhost:5000/ads${pageNr ? '/' + pageNr : ''}`
    console.log(url)
    const response = await fetch(url)
    const data = await response.json()
    const records = data as DbRecord[]
    // console.log(records)
    return records
  })
  if (isLoading) return <p>Loading...</p>
  if (isError) {
    if (error instanceof Error) {
      return <p>Error: {error.message}</p>
    }
    return <p>Unexpected error when fetching exchange data.</p>
  }

  return (
    <>
      <SimpleGrid cols={5}>
        {data?.map((record) => (
          <Card shadow="sm" padding="lg" radius="md" withBorder key={record.id}>
            <Card.Section>
              <Image src={record.data.thumbnails[0]} height={160} alt={record.data.title || ''} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{record.data.title || ''}</Text>
              <Badge color="pink" variant="light">
                Nejlepší cena
              </Badge>
            </Group>

            <Text size="md" c="dimmed">
              {record.data.price ? record.data.price + ' Kč' : 'Informace v kanceláři'}
            </Text>

            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Více informací
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </>
  )
}
