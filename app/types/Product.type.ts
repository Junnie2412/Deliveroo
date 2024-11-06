import { Categories } from './Categories.type'
import { Store } from './Store.type'

export type Product = {
  id: string
  productName: string
  briefDescription: string
  fullDescription: string
  technicalSpecification: string
  imageURL: string
  price: number
  category: Categories
  store: Store
  isActive: boolean
}
