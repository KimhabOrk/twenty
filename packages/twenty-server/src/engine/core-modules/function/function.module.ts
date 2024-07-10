import { Module } from '@nestjs/common';

import { FunctionService } from 'src/engine/core-modules/function/function.service';
import { FunctionResolver } from 'src/engine/core-modules/function/function.resolver';
import { FileUploadModule } from 'src/engine/core-modules/file/file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  providers: [FunctionService, FunctionResolver],
})
export class FunctionModule {}
