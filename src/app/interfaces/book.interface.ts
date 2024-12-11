export interface Book {
  index: number
  author: string
  name: string
  created: Date | null
  about?: string | null
}
