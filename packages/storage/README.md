# @v1/storage

Package para upload e gerenciamento de arquivos usando Cloudflare R2.

## 🚀 Features

- ✅ **Upload direto** para Cloudflare R2
- ✅ **URLs pré-assinadas** para upload/download seguro
- ✅ **Transformação de imagens** com Sharp
- ✅ **Validação de arquivos** (tamanho, tipo)
- ✅ **Componentes React** para upload
- ✅ **Utilitários** para manipulação de arquivos
- ✅ **Logs detalhados** para debugging

## 📦 Instalação

```bash
# O package já está incluído no workspace
# Apenas instale as dependências
bun install
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

```bash
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_REGION=auto
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

# Upload API
UPLOAD_API_URL=https://your-domain.com/api/upload
```

### 2. Configuração do Cloudflare R2

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá para **R2 Object Storage**
3. Crie um novo bucket
4. Crie uma API Token com permissões de R2
5. Configure as variáveis de ambiente

## 📖 Uso

### Server-Side (R2Storage)

```typescript
import { createR2Storage } from '@v1/storage/server';
import type { StorageConfig } from '@v1/storage/types';

const config: StorageConfig = {
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME!,
};

const storage = createR2Storage(config);

// Upload arquivo
const result = await storage.upload('uploads/image.jpg', fileBuffer, {
  contentType: 'image/jpeg',
  public: true,
  metadata: { userId: '123' }
});

// Gerar URL pré-assinada
const presignedUrl = await storage.getPresignedUploadUrl('uploads/file.pdf', {
  expiresIn: 3600,
  contentType: 'application/pdf'
});

// Listar arquivos
const files = await storage.list({ prefix: 'uploads/' });

// Deletar arquivo
await storage.delete('uploads/old-file.jpg');
```

### Client-Side (ClientStorage)

```typescript
import { createClientStorage } from '@v1/storage/client';

const clientStorage = createClientStorage({
  uploadUrl: '/api/upload',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/*', 'application/pdf']
});

// Upload arquivo
const result = await clientStorage.uploadFile(file);

// Upload múltiplos arquivos
const results = await clientStorage.uploadFiles([file1, file2], 'uploads/');

// URL de imagem com transformações
const imageUrl = clientStorage.getImageUrl('uploads/image.jpg', {
  width: 300,
  height: 200,
  quality: 80,
  format: 'webp'
});
```

### Componentes React

```tsx
import { FileUpload } from '@v1/storage/components';

function MyUploadComponent() {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  };

  return (
    <FileUpload
      onUpload={handleUpload}
      accept="image/*"
      maxSize={5 * 1024 * 1024} // 5MB
      multiple={true}
      onUploadComplete={(result) => {
        console.log('Upload completed:', result);
      }}
    />
  );
}
```

### Utilitários

```typescript
import { 
  getMimeType, 
  transformImage, 
  generateUniqueFilename,
  formatFileSize,
  isImage 
} from '@v1/storage/utils';

// Detectar tipo MIME
const mimeType = getMimeType('image.jpg'); // 'image/jpeg'

// Transformar imagem
const resizedImage = await transformImage(imageBuffer, {
  width: 300,
  height: 200,
  quality: 80,
  format: 'webp'
});

// Gerar nome único
const filename = generateUniqueFilename('photo.jpg', 'uploads'); 
// 'uploads/photo-1703123456789-abc123.jpg'

// Formatar tamanho
const size = formatFileSize(1024 * 1024); // '1 MB'

// Verificar se é imagem
const isImageFile = isImage('image/png'); // true
```

## 🔄 API Routes

### Upload API

```typescript
// app/api/upload/route.ts
import { createR2Storage } from '@v1/storage/server';
import { NextRequest, NextResponse } from 'next/server';

const storage = createR2Storage({
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = formData.get('key') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await storage.upload(key, buffer, {
      contentType: file.type,
      public: true
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    );
  }
}
```

### Presigned URL API

```typescript
// app/api/upload/presigned/route.ts
import { createR2Storage } from '@v1/storage/server';
import { NextRequest, NextResponse } from 'next/server';

const storage = createR2Storage({
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME!,
});

export async function POST(request: NextRequest) {
  try {
    const { key, contentType, expiresIn = 3600 } = await request.json();
    
    const presignedUrl = await storage.getPresignedUploadUrl(key, {
      expiresIn,
      contentType
    });

    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' }, 
      { status: 500 }
    );
  }
}
```

## 🖼️ Transformação de Imagens

O package suporta transformações de imagem usando Sharp:

```typescript
import { transformImage } from '@v1/storage/utils';

// Redimensionar
const resized = await transformImage(buffer, {
  width: 300,
  height: 200,
  fit: 'cover'
});

// Converter formato
const webp = await transformImage(buffer, {
  format: 'webp',
  quality: 80
});

// Aplicar efeitos
const processed = await transformImage(buffer, {
  blur: 5,
  rotate: 90,
  flip: 'horizontal'
});
```

## 🔒 Segurança

### URLs Pré-assinadas

Use URLs pré-assinadas para uploads seguros:

```typescript
// Gerar URL para upload
const uploadUrl = await storage.getPresignedUploadUrl('uploads/file.pdf', {
  expiresIn: 3600, // 1 hora
  contentType: 'application/pdf'
});

// Gerar URL para download
const downloadUrl = await storage.getPresignedDownloadUrl('uploads/file.pdf', 3600);
```

### Validação de Arquivos

```typescript
import { validateFileSize, validateFileType } from '@v1/storage/utils';

// Validar tamanho
const isValidSize = validateFileSize(file.size, 10 * 1024 * 1024); // 10MB

// Validar tipo
const isValidType = validateFileType(file.type, ['image/*', 'application/pdf']);
```

## 📊 Monitoramento

### Logs

O package usa o logger do projeto para registrar operações:

```typescript
// Logs automáticos para:
// - Uploads bem-sucedidos
// - Erros de upload
// - Operações de delete
// - Geração de URLs pré-assinadas
```

### Métricas

Você pode adicionar métricas personalizadas:

```typescript
const result = await storage.upload(key, buffer, {
  metadata: {
    userId: '123',
    uploadSource: 'web',
    timestamp: new Date().toISOString()
  }
});
```

## 🚨 Troubleshooting

### Erro de Autenticação

```bash
# Verificar variáveis de ambiente
echo $R2_ACCOUNT_ID
echo $R2_ACCESS_KEY_ID
echo $R2_SECRET_ACCESS_KEY
echo $R2_BUCKET_NAME
```

### Erro de Upload

1. Verificar permissões do bucket
2. Verificar tamanho do arquivo
3. Verificar tipo de arquivo
4. Verificar conectividade de rede

### Erro de Transformação de Imagem

1. Verificar se o Sharp está instalado
2. Verificar se o arquivo é uma imagem válida
3. Verificar parâmetros de transformação

## 📋 Checklist de Configuração

- [ ] Variáveis de ambiente configuradas
- [ ] Bucket R2 criado
- [ ] API Token configurado
- [ ] Permissões de bucket configuradas
- [ ] API routes criadas
- [ ] Componentes testados
- [ ] Logs funcionando

## 🔗 Links Úteis

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS S3 SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-examples.html)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
