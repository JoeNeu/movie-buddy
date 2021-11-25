import { Pipe, PipeTransform } from '@angular/core';
import {tmdbVideo} from "../models/the-movie-db.model";

@Pipe({
  name: 'movieFilter'
})
export class MovieFilterPipe implements PipeTransform {
  transform(items: tmdbVideo[], searchText: number): tmdbVideo[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter((item) => item.genre_ids.includes(searchText));
  }
}
