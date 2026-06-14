import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface S3Client {
  send(command: unknown): Promise<unknown>;
}

interface PutObjectCommandInput {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

interface DeleteObjectCommandInput {
  Bucket: string;
  Key: string;
}

interface GetObjectCommandInput {
  Bucket: string;
  Key: string;
}

let S3ClientClass: new (config: {
  endpoint?: string;
  region: string;
  credentials?: { accessKeyId: string; secretAccessKey: string };
  forcePathStyle?: boolean;
}) => S3Client;

let PutObjectCommandClass: new (input: PutObjectCommandInput) => unknown;
let DeleteObjectCommandClass: new (input: DeleteObjectCommandInput) => unknown;
let GetObjectCommandClass: new (input: GetObjectCommandInput) => unknown;
let getSignedUrlFn: (
  client: S3Client,
  command: unknown,
  options?: { expiresIn?: number },
) => Promise<string>;

let awsLoaded = false;

function loadAwsSdk(): boolean {
  if (awsLoaded) return true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const s3 = require('@aws-sdk/client-s3');
    S3ClientClass = s3.S3Client;
    PutObjectCommandClass = s3.PutObjectCommand;
    DeleteObjectCommandClass = s3.DeleteObjectCommand;
    GetObjectCommandClass = s3.GetObjectCommand;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const presigner = require('@aws-sdk/s3-request-presigner');
    getSignedUrlFn = presigner.getSignedUrl;
    awsLoaded = true;
    return true;
  } catch {
    return false;
  }
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storageType: 's3' | 'local';
  private readonly localBasePath: string;
  private readonly baseUrl: string;

  private s3Client: S3Client | null = null;
  private readonly s3Bucket: string;
  private readonly s3Endpoint: string;
  private readonly s3Region: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Endpoint = this.configService.get<string>('s3.endpoint') ?? '';
    this.s3Region = this.configService.get<string>('s3.region') ?? 'us-east-1';
    this.s3Bucket =
      this.configService.get<string>('s3.bucket') ?? 'dms-uploads';
    this.localBasePath = path.resolve(process.cwd(), 'uploads');
    this.baseUrl =
      this.configService.get<string>('app.corsOrigin') ??
      'http://localhost:3001';

    const accessKey = this.configService.get<string>('s3.accessKey');
    const secretKey = this.configService.get<string>('s3.secretKey');

    if (this.s3Endpoint && accessKey && secretKey && loadAwsSdk()) {
      this.storageType = 's3';
      this.s3Client = new S3ClientClass({
        endpoint: this.s3Endpoint,
        region: this.s3Region,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
        forcePathStyle: true,
      });
      this.logger.log(`Storage: S3 mode (bucket=${this.s3Bucket})`);
    } else {
      this.storageType = 'local';
      fs.mkdirSync(this.localBasePath, { recursive: true });
      this.logger.log(
        `Storage: Local filesystem mode (base=${this.localBasePath})`,
      );
    }
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<{ filePath: string; fileUrl: string }> {
    if (this.storageType === 's3' && this.s3Client) {
      return this.uploadToS3(buffer, key, mimeType);
    }
    return this.uploadToLocal(buffer, key);
  }

  async deleteFile(key: string): Promise<void> {
    if (this.storageType === 's3' && this.s3Client) {
      return this.deleteFromS3(key);
    }
    return this.deleteFromLocal(key);
  }

  async getFileUrl(key: string): Promise<string> {
    if (this.storageType === 's3') {
      return `${this.s3Endpoint}/${this.s3Bucket}/${key}`;
    }
    return `${this.baseUrl}/uploads/${key}`;
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (this.storageType === 's3' && this.s3Client) {
      return this.getS3SignedUrl(key, expiresIn);
    }
    return this.getFileUrl(key);
  }

  private async uploadToS3(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<{ filePath: string; fileUrl: string }> {
    const command = new PutObjectCommandClass({
      Bucket: this.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3Client!.send(command);

    return {
      filePath: key,
      fileUrl: `${this.s3Endpoint}/${this.s3Bucket}/${key}`,
    };
  }

  private async deleteFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommandClass({
      Bucket: this.s3Bucket,
      Key: key,
    });

    await this.s3Client!.send(command);
  }

  private async getS3SignedUrl(
    key: string,
    expiresIn: number,
  ): Promise<string> {
    const command = new GetObjectCommandClass({
      Bucket: this.s3Bucket,
      Key: key,
    });

    return getSignedUrlFn(this.s3Client!, command, { expiresIn });
  }

  private async uploadToLocal(
    buffer: Buffer,
    key: string,
  ): Promise<{ filePath: string; fileUrl: string }> {
    const fullPath = path.join(this.localBasePath, key);
    const dir = path.dirname(fullPath);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, buffer);

    return {
      filePath: key,
      fileUrl: `${this.baseUrl}/uploads/${key}`,
    };
  }

  private async deleteFromLocal(key: string): Promise<void> {
    const fullPath = path.join(this.localBasePath, key);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
