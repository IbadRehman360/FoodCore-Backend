import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';

@Entity('recipe_favorites')
@Unique(['userId', 'recipeId'])
export class RecipeFavorite extends BaseEntity {
  @Column() userId: string;
  @Column() recipeId: string;
}
