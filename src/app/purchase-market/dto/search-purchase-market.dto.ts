import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPositive, Min } from 'class-validator';
import { SearchPurchaseMarketFilter } from 'src/core/types/purchase-market.interface';

export class SearchPurchaseMarketDto implements SearchPurchaseMarketFilter {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  limit: number = 10;
}
