import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeFavorite } from './entities/recipe-favorite.entity';
import { RecipesController } from './controllers/recipes.controller';
import { RecipesService } from './services/recipes.service';
import { RecipesRepository } from './repositories/recipes.repository';
import { RecipeFavoritesRepository } from './repositories/recipe-favorites.repository';
import { StorageModule } from '@modules/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeFavorite]), StorageModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository, RecipeFavoritesRepository],
  exports: [RecipesService],
})
export class RecipesModule {}
