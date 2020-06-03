import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFileName } from './file-upload.utils';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../accounts/get-account.decorator';
import { Account } from '../accounts/account.entity';
import { StoragesService } from './storages.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('storages')
export class StoragesController {
  constructor(private storagesService: StoragesService) {}

  @Post('upload/folder/:folderId')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('files', {
      storage: diskStorage({
        destination: './upload',
        filename: generateFileName
      })
    })
  )
  uploadFile(
    @Param('folderId', ParseIntPipe) folderId: number,
    @GetAccount() account: Account,
    @UploadedFile() file: UploadFileDto
  ) {
    return this.storagesService.saveFileToFolder(folderId, file, account);
  }

  @Get('upload/:filename')
  async serveAvatar(
    @Param('filename') fileName: string,
    @Res() res: any
  ): Promise<any> {
    res.sendFile(fileName, { root: 'upload' });
  }
}
