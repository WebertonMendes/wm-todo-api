import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsNumber } from 'class-validator';

import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  attachment?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  category_id?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    default: false,
    required: false,
  })
  is_finished?: boolean;
}
