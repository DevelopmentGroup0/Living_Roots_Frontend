export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Rating[]
}

export interface Rating {
  Source: string
  Value: string
}

export type Genres =
  | 'Acción y Aventuras'
  | 'Anime'
  | 'Drama'
  | 'Documental'
  | 'Fantasía'
  | 'Romance'
  | 'Comedia'
  | 'Horror'
  | 'Niños'
  | 'Ciencia ficción'
  | 'Misterio'
  | 'Thriller'
export type RentState = 'available' | 'reserved' | 'unavailable'
export type QualityOption = '720p' | '1080p' | '4k'

export interface FetchingMovies {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

export interface MovieInCart {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Genre: string
  Poster: string
  quality: QualityOption
  state: 'Alquilar' | 'Comprar'
  days?: number
  price: Money
}

type Money = {
  amount: number // entero
  currency: string
}
