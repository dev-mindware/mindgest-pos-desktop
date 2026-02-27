"""
Exemplo de requisição ao microserviço de documentação.
Use para testar a API localmente.
"""

import requests
import json
from datetime import datetime

# URL base da API
BASE_URL = "http://localhost:3002"

# Exemplo de payload completo
example_payload = {
    "documentType": "invoice",
    "format": "pdf",
    "invoiceNumber": "INV-2024-001",
    "invoiceDate": datetime.now().isoformat(),
    "dueDate": datetime(2024, 2, 1).isoformat(),
    "company": {
        "id": "comp-001",
        "name": "MindGest Software",
        "taxId": "123456789",
        "address": "Rua da Tecnologia, 123",
        "email": "info@mindgest.pt",
        "phone": "+351 21 1234567",
        "website": "www.mindgest.pt"
    },
    "client": {
        "id": "client-001",
        "name": "Cliente Exemplo Ltda",
        "taxId": "987654321",
        "address": "Avenida Principal, 456",
        "email": "contato@cliente.pt",
        "phone": "+351 22 7654321"
    },
    "items": [
        {
            "id": "item-1",
            "description": "Desenvolvimento de Software",
            "quantity": 1,
            "unitPrice": 2000.00,
            "totalPrice": 2000.00,
            "tax": 460.00
        },
        {
            "id": "item-2",
            "description": "Consultoria Técnica",
            "quantity": 4,
            "unitPrice": 500.00,
            "totalPrice": 2000.00,
            "tax": 460.00
        }
    ],
    "subtotal": 4000.00,
    "tax": 920.00,
    "total": 4920.00,
    "notes": "Pagamento a 30 dias. Transferência bancária.",
    "paymentTerms": "Net 30",
    "retentionAmount": 50.00,
    "metadata": {
        "projectId": "PROJ-2024-001",
        "reference": "PO-2024-001"
    }
}

def test_health_check():
    """Teste health check."""
    print("\n=== Health Check ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_generate_pdf():
    """Teste geração de PDF."""
    print("\n=== Generate PDF ===")
    payload = example_payload.copy()
    payload["format"] = "pdf"
    
    response = requests.post(f"{BASE_URL}/generate-document", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_generate_xml():
    """Teste geração de XML."""
    print("\n=== Generate XML ===")
    payload = example_payload.copy()
    payload["format"] = "xml"
    
    response = requests.post(f"{BASE_URL}/generate-document", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_generate_docx():
    """Teste geração de DOCX."""
    print("\n=== Generate DOCX ===")
    payload = example_payload.copy()
    payload["format"] = "docx"
    
    response = requests.post(f"{BASE_URL}/generate-document", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_download_pdf():
    """Teste download de PDF."""
    print("\n=== Download PDF ===")
    payload = example_payload.copy()
    payload["format"] = "pdf"
    
    response = requests.post(f"{BASE_URL}/generate-document/download", json=payload)
    
    if response.status_code == 200:
        filename = "downloaded_invoice.pdf"
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Arquivo salvo: {filename}")
        print(f"Tamanho: {len(response.content)} bytes")
    else:
        print(f"Erro: {response.status_code}")
        print(f"Response: {response.text}")

def main():
    """Execute todos os testes."""
    try:
        print("Iniciando testes do microserviço de documentação...")
        
        test_health_check()
        test_generate_pdf()
        test_generate_xml()
        test_generate_docx()
        test_download_pdf()
        
        print("\n=== Testes Concluídos ===\n")
        
    except requests.exceptions.ConnectionError:
        print("Erro: Não foi possível conectar ao serviço.")
        print("Certifique-se de que o microserviço está rodando em http://localhost:1")
    except Exception as e:
        print(f"Erro inesperado: {str(e)}")

if __name__ == "__main__":
    main()
