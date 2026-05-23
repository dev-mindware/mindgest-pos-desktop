# MindGest Document Generator Microservice

Microserviço Python especializado em geração de documentos (PDF, XML, DOCX) para o sistema MindGest.

## Arquitetura

```
python-microservice/
├── app/
│   ├── modules/
│   │   ├── pdf/          # Geração de PDFs (ReportLab)
│   │   ├── xml/          # Geração de XMLs (lxml)
│   │   ├── docx/         # Geração de DOCX (python-docx)
│   │   └── common/       # Utilitários comuns
│   ├── main.py           # FastAPI app
│   └── schemas.py        # Pydantic models
├── config/
│   └── settings.py       # Configurações
├── templates/            # Templates de documentos
├── fonts/               # Fonts customizadas
└── logs/                # Logs da aplicação
```

## Tecnologias

- **FastAPI**: Framework REST assíncrono
- **ReportLab**: Geração de PDFs avançada
- **lxml**: Processamento XML
- **python-docx**: Geração de documentos Word
- **Pydantic**: Validação de dados
- **Uvicorn**: ASGI server

## Instalação Local

### Pré-requisitos
- Python 3.11+
- pip ou poetry

### Setup

```bash
# Navegar ao diretório
cd python-microservice

# Criar virtual environment
python -m venv venv

# Ativar (Windows)
venv\Scripts\activate

# Ativar (Linux/Mac)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Copiar arquivo de configuração
cp .env.example .env

# Executar aplicação
python -m uvicorn app.main:app --reload --port 5000
```

A API estará disponível em: `http://localhost:5000`

Documentação interativa: `http://localhost:5000/docs`

## Uso com Docker

### Build
```bash
cd python-microservice
docker build -t mindgest-doc-generator:latest .
```

### Run
```bash
docker run -p 5000:5000 \
  -e SERVICE_PORT=5000 \
  -e NESTJS_API_URL=http://api:3000 \
  mindgest-doc-generator:latest
```

### Com Docker Compose
```bash
docker-compose up -d doc-generator
```

## Endpoints

### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T12:00:00"
}
```

### 2. Gerar Documento
```http
POST /generate-document
Content-Type: application/json

{
  "documentType": "invoice",
  "format": "pdf",
  "invoiceNumber": "INV-2024-001",
  "invoiceDate": "2024-01-01T12:00:00",
  "dueDate": "2024-02-01T12:00:00",
  "company": {
    "id": "comp-123",
    "name": "Sua Empresa",
    "taxId": "123456789",
    "address": "Rua Principal, 123",
    "city": "Lisboa",
    "postalCode": "1000-001",
    "country": "Portugal",
    "email": "info@empresa.pt",
    "phone": "+351 21 1234567",
    "website": "www.empresa.pt"
  },
  "client": {
    "id": "client-456",
    "name": "Cliente XYZ",
    "taxId": "987654321",
    "address": "Rua Secundária, 456",
    "city": "Porto",
    "postalCode": "4000-001",
    "country": "Portugal",
    "email": "contato@cliente.pt",
    "phone": "+351 22 7654321"
  },
  "items": [
    {
      "id": "item-1",
      "description": "Serviço de Consultoria",
      "quantity": 2,
      "unitPrice": 500.00,
      "totalPrice": 1000.00,
      "tax": 230.00
    }
  ],
  "subtotal": 1000.00,
  "tax": 230.00,
  "total": 1230.00,
  "notes": "Pagamento a 30 dias",
  "paymentTerms": "30 dias",
  "retentionAmount": 100.00,
  "metadata": {
    "reference": "PO-2024-001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document generated successfully",
  "fileName": "invoice_INV-2024-001_20240101_120000.pdf",
  "format": "pdf",
  "generatedAt": "2024-01-01T12:00:00"
}
```

### 3. Gerar e Download
```http
POST /generate-document/download
Content-Type: application/json

{ /* mesmo payload acima */ }
```

**Response:** Ficheiro binário (PDF, XML ou DOCX)

## Formatos Suportados

### PDF
- Layout profissional com ReportLab
- Suporte a tabelas e formatação avançada
- Fontes personalizáveis
- Margens e espaçamento configuráveis

### XML
- Estrutura completa e bem-formada
- Compatível com sistemas de integração
- Dados estruturados hierarquicamente

### DOCX
- Documentos Word editáveis
- Tabelas e formatação
- Compatível com MS Office

## Configuração

Editar `.env` para customizar:

```env
# Serviço
SERVICE_HOST=0.0.0.0
SERVICE_PORT=5000
DEBUG=False

# API NestJS (para callbacks/integrações futuras)
NESTJS_API_URL=http://api:3000

# Logging
LOG_LEVEL=INFO

# CORS
ALLOWED_ORIGINS=http://localhost:3001,http://api:3000
```

## Estrutura de Módulos

### PDF Module
- `PDFGenerator`: Classe principal para geração
- Estilos customizados
- Suporte a retenção e múltiplos tipos de documento

### XML Module
- `XMLGenerator`: Geração de XML estruturado
- Hierarquia completa de dados

### DOCX Module
- `DOCXGenerator`: Geração de documentos Word
- Tabelas e formatação

### Common Module
- `logger.py`: Sistema de logging centralizado
- `utils.py`: Funções utilitárias (formatting, file handling)

## Desenvolvimento

### Executar testes
```bash
pytest
```

### Code linting
```bash
flake8 app/
black app/
```

### Gerar cobertura
```bash
pytest --cov=app
```

## Integração com NestJS

### 1. Adicionar serviço no NestJS

```typescript
@Injectable()
export class DocumentGeneratorService {
  constructor(private http: HttpService) {}

  async generatePDF(invoiceData: Invoice): Promise<Buffer> {
    const response = await this.http.post(
      'http://doc-generator:5000/generate-document/download',
      {
        documentType: invoiceData.type,
        format: 'pdf',
        invoiceNumber: invoiceData.number,
        // ... resto do mapping
      }
    ).toPromise();
    
    return response.data;
  }
}
```

### 2. Usar no controller

```typescript
@Post('/:id/download-pdf')
async downloadPDF(@Param('id') id: string) {
  const invoice = await this.invoiceService.findOne(id);
  const pdf = await this.documentGenerator.generatePDF(invoice);
  
  return {
    content: pdf,
    filename: `${invoice.number}.pdf`
  };
}
```

## Troubleshooting

### Erro: "Module not found"
```bash
pip install -r requirements.txt
```

### Erro: "Port already in use"
```bash
# Mudar porta em .env
SERVICE_PORT=3002
```

### Documentos não gerados
- Verificar logs: `logs/mindgest-doc-generator.log`
- Validar payload contra schema em `app/schemas.py`

## Performance

- Limpeza automática de ficheiros antigos (7 dias)
- Processamento assíncrono
- Cache de estilos e fontes
- Suporta múltiplas requisições simultâneas

## License

MIT
