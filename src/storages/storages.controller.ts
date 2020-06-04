import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
  ParseIntPipe,
  Body,
  Delete,
  Patch
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFileName } from './file-upload.utils';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../accounts/get-account.decorator';
import { Account } from '../accounts/account.entity';
import { StoragesService } from './storages.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('storages')
export class StoragesController {
  constructor(private storagesService: StoragesService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  getMyStorage(
    @GetAccount() account: Account,
  ) {
    return this.storagesService.getMyStorage(account);
  }
  

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


  @Get('folder/:folderId')
  @UseGuards(AuthGuard())
  getFolder(
    @Param('folderId', ParseIntPipe) folderId: number,
    @GetAccount() account: Account,
  ) {
    return this.storagesService.getFolder(folderId, account);
  }

  @Patch('folder/:folderId')
  @UseGuards(AuthGuard())
  updateFolder(
    @Param('folderId', ParseIntPipe) folderId: number,
    @Body() updateFolderDto: UpdateFolderDto,
    @GetAccount() account: Account,
  ) {
    return this.storagesService.updateFolder(updateFolderDto, folderId, account);
  }

  @Post('folder')
  @UseGuards(AuthGuard())
  createFolder(
    @Body() createFolderDto: CreateFolderDto,
    @GetAccount() account: Account,
  ) {
    return this.storagesService.createFolder(createFolderDto, account);
  }

  @Delete('folder/:folderId/file/:fileId')
  @UseGuards(AuthGuard())
  deleteFile(
    @Param('folderId', ParseIntPipe) folderId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
    @GetAccount() account: Account,
  ) {
    return this.storagesService.deleteFile(folderId, fileId, account);
  }

  @Patch('folder/:folderId/file/:fileId')
  @UseGuards(AuthGuard())
  updateFile(
    @Param('folderId', ParseIntPipe) folderId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
    @Body() updateFileDto: UpdateFileDto,
    @GetAccount() account: Account,
  ) {
    return this.storagesService.updateFile(updateFileDto, folderId, fileId, account);
  }

  @Delete('folder/:folderId/child-folder/:childFolderId')
  @UseGuards(AuthGuard())
  deleteChildFolder(
    @Param('folderId', ParseIntPipe) folderId: number,
    @Param('childFolderId', ParseIntPipe) childFolderId: number,
    @GetAccount() account: Account,
  ) {
    return this.storagesService.deleteChildFolder(folderId, childFolderId, account);
  }

}
