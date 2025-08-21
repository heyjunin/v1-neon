# Storage Package

Este package fornece funcionalidades de upload e gerenciamento de arquivos com suporte a drag & drop usando react-dropzone e integração com S3/R2.

## Componentes

### DropzoneUpload

Componente de upload com drag & drop que permite upload de múltiplos arquivos diretamente para S3/R2.

#### Props

```typescript
interface DropzoneUploadProps {
  onUpload: (file: File) => Promise<UploadResult>;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
  onFilesChange?: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  uploadText?: string;
  dragText?: string;
}
```

#### Exemplo de Uso

```tsx
import { DropzoneUpload } from '@v1/storage/components';

function MyComponent() {
  const handleUpload = async (file: File) => {
    // Implementar lógica de upload
    const result = await uploadToS3(file);
    return result;
  };

  return (
    <DropzoneUpload
      onUpload={handleUpload}
      onUploadComplete={(result) => console.log('Uploaded:', result)}
      onUploadError={(error) => console.error('Error:', error)}
      maxSize={50 * 1024 * 1024} // 50MB
      maxFiles={10}
      showPreview={true}
    />
  );
}
```

### FileUpload

Componente de upload tradicional com input de arquivo.

## Hooks

### useUpload

Hook personalizado para gerenciar estados de upload.

```typescript
const { uploadStates, isUploading, uploadFiles, removeFile, retryUpload } = useUpload({
  onUpload: handleUpload,
  onUploadComplete: handleComplete,
  onUploadError: handleError,
});
```

## Cliente de Storage

### ClientStorage

Cliente para upload de arquivos do lado do cliente.

```typescript
import { createClientStorage } from '@v1/storage/client';

const storageClient = createClientStorage({
  uploadUrl: '/api/upload',
  maxFileSize: 50 * 1024 * 1024,
  allowedTypes: ['image/*', 'application/pdf'],
});

// Upload de arquivo
const result = await storageClient.uploadFile(file);

// Upload de múltiplos arquivos
const results = await storageClient.uploadFiles(files);
```

## Servidor de Storage

### R2Storage

Cliente para operações de storage no servidor (R2/S3).

```typescript
import { createR2Storage } from '@v1/storage/server';

const storage = createR2Storage({
  accountId: 'your-account-id',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
  bucketName: 'your-bucket',
});

// Upload
const result = await storage.upload('path/to/file.jpg', fileBuffer);

// Gerar URL pré-assinada
const presignedUrl = await storage.getPresignedUploadUrl('path/to/file.jpg');
```

## Tipos

```typescript
interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
  etag: string;
}

interface StorageConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
  endpoint?: string;
}
```

## Funcionalidades

- ✅ Upload com drag & drop
- ✅ Upload de múltiplos arquivos
- ✅ Progress tracking
- ✅ Preview de imagens
- ✅ Validação de tipos de arquivo
- ✅ Validação de tamanho
- ✅ Retry de uploads falhados
- ✅ Integração com S3/R2
- ✅ URLs pré-assinadas
- ✅ Transformação de imagens
- ✅ Gerenciamento de estados

## Configuração

1. Instale as dependências:
```bash
bun install
```

2. Configure as variáveis de ambiente:
```env
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket
```

3. Use os componentes em sua aplicação:
```tsx
import { DropzoneUpload } from '@v1/storage/components';
```

## Exemplos

Veja o arquivo `src/examples/dropzone-example.tsx` para um exemplo completo de uso.
