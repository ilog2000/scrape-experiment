export interface AdInfo {
  id: string
  href: string
  title: string | null
  thumbnails: string[]
}

export interface AdDetails extends AdInfo {
  description: string | null
  price: string | null
  location: string | null
  energyClass: string | null
  images: string[]
  params: Map<string, string>
}

export interface DbRecord {
  id: string
  data: AdDetails
}
