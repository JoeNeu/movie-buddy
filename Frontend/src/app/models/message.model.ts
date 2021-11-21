export class MessageModel {
  sender: string
  receiver: string
  text: string
  movieId?: number
  type?: string
  resolvedMovie?: any
}

export class RatingModel {
  movieId: number
  count: number
}
