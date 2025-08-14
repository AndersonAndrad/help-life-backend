import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Min, ValidateNested } from 'class-validator';
import { Permittion, PurchaseItem } from 'src/core/types/purchase-market.interface';

export class PurchaseItemDto implements PurchaseItem {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsNumber()
  @IsPositive()
  totalPrice: number;
}

export class PurchaseMarketEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(Permittion, { each: true })
  permittions: Permittion[];

  @IsBoolean()
  creator: boolean;
}

export class CreatePurchaseMarketDto {
  @IsString()
  @IsNotEmpty()
  marketName: string;

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseMarketEmailDto)
  emails: PurchaseMarketEmailDto[];
}
