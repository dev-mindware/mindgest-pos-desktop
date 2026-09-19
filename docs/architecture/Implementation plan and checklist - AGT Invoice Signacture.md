# Implementation plan and checklist - AGT Invoice Signature

## Objetivo
- Implementar o fluxo AGT de forma profissional e escalável no `MINDGEST-API`.
- Garantir que as séries são sempre fornecidas pela AGT e nunca geradas localmente.
- Assegurar que facturas offline sincronizadas usam a mesma série e sequência do estabelecimento, evitando duplicados.
- Garantir que o número de factura oficial é consistente entre todos os nós que partilham a mesma `establishmentNumber`.

## Observações importantes
- As séries de facturas nunca são criadas localmente; elas são requisitadas diretamente à AGT via `AgtSeriesService.solicitarSerie()`.
- O campo `establishmentNumber` distingue o tipo/loja e deve ser usado como identidade de série.
- A sequência de facturas deve ser gerida atômica e exclusivamente pela série AGT associada a `(documentType, seriesYear, companyId, establishmentNumber)`.
- O número de factura deve ser montado como `DOCUMENT_TYPE SERIES_CODE/SEQUENCE`.

## Plano de implementação

1. Reforçar o modelo de séries AGT
   - Validar que `AgtSeries` é indexado por `documentType`, `seriesYear`, `companyId` e `establishmentNumber`.
   - Persistir `seriesCode`, `currentSequence`, `lastDocumentNo` e `isActive` após resposta bem sucedida da AGT.
   - Usar `establishmentNumber` para distinguir lojas e séries.

2. Garantir que nunca há geração de série local
   - Remover qualquer fallback que crie ou normalize série local para TG-AGT-bound invoices.
   - O `SequenceChainingService` deve exigir `AgtSeries` ativa para o documento AGT.
   - Se não houver série AGT disponível, a criação da factura deve falhar com erro claro e instrução para solicitar série.

3. Implementar geração de número atômica e segura
   - Atualizar `AgtSeriesService.getNextNumber(companyId, documentType, establishmentNumber)` para:
     * recuperar a série correta por `establishmentNumber`;
     * fazer `update` atômico `currentSequence: { increment: 1 }` no Prisma;
     * retornar `documentType seriesCode/currentSequence`.
   - Garantir que esta operação ocorre dentro de transação quando usada em `generateNextInvoiceSequence()`.
   - Evitar dupla numeração com bloqueio na base de dados (via update atômico e chave única).

4. Atualizar a sequência de facturação na Cloud
   - Em `SequenceChainingService.generateNextInvoiceSequence(...)`:
     * usar o mesmo `establishmentNumber` do store/terminal;
     * mapear `InvoiceType.INVOICE_RECEIPT` para `FR`, `NORMAL_INVOICE` para `FT`, etc;
     * buscar `previousHash` do último documento na mesma série;
     * construir `nextNumber` com `seriesCode` e sequência oficial.
   - Garantir que o hash encadeado usa apenas documentos da mesma série e tipo.

5. Fluxo de criação de factura offline sync
   - O payload do POS deve conter `storeId`, `companyId`, `client.offlineId`, `items`, `establishmentNumber`/loja, e o `agtNo` oficial quando já gerado localmente.
   - O POS offline deve marcar documentos como `offline: true` e preservar o número AGT se já estiver atribuído.
   - A Cloud deve usar este contexto para:
     * reconciliar clientes por `offlineId`;
     * aceitar `agtNo` offline já numerado sem renumerar;
     * criar item/invoice mantendo o número oficial enviado;
     * enfileirar submissão AGT.

6. Assinatura AGT e submissão de documento
   - Confirmar que `AgtService.prepareDocumentSignaturePayload(...)` usa campos AGT exigidos.
   - Manter o fluxo:
     * `jwsSoftwareSignature` com chave de produtor;
     * `jwsDocumentSignature` com a chave do contribuinte;
     * enviar documento para AGT via `AgtApiService.registerInvoice()`.
   - Persistir status AGT e erros em `invoice.agtStatus` / `invoice_errors`.

7. Consistência multi-terminal
   - Quando vários terminais compartilham a mesma loja/establishmentNumber, todos devem usar a mesma série AGT.
   - O `AgtSeries.currentSequence` deve ser a única fonte de verdade para gerar números.
   - Usar a mesma série se o estabelecimento for o mesmo, garantindo continuidade entre terminais.

8. Visibilidade e operação
   - Expor `GET /agt/series` para listar séries ativas.
   - Documentar que a série deve ser solicitada antes de emitir facturas.
   - Fornecer mensagem de erro clara caso série AGT não exista.

## Checklist de implementação

- [x] `AgtSeriesService.solicitarSerie()` enviada corretamente à AGT e persistida no DB
- [x] `AgtSeriesService.getNextNumber()` recebe e usa `establishmentNumber`
- [x] `AgtSeriesService.getNextNumber()` incrementa `currentSequence` de forma atômica
- [x] `SequenceChainingService.generateNextInvoiceSequence()` usa a série AGT correta
- [x] Criação de factura bloqueada se não existir `AgtSeries` ativa para o estabelecimento
- [x] Número de factura gerado como `DOCUMENT_TYPE SERIES_CODE/SEQUENCE`
- [x] `previousHash` calculado a partir do último documento da mesma série
- [x] Payload offline do POS inclui `client.offlineId`, `storeId`, `establishmentNumber` e `agtNo` quando disponível

## Notas de engenharia para evitar duplicação
- Use `AgtSeries` como fonte única de verdade para sequência.
- Nunca use `counter` derivado do número de facturas locais quando `AgtSeries` existe.
- Se há duas facturas em paralelo com mesma série, a atualização `currentSequence` deve ser atômica no banco.
- Confirme que `invoice.number` tem restrição única e que o mesmo `seriesCode/sequence` não pode ser criado duas vezes.

## Prioridade imediata
1. Fazer o `establishmentNumber` obrigatório para gerar série AGT.
2. Proteger `getNextNumber()` com transação atômica e chave única.
3. Remover fallback de série local para AGT-bound invoices.
4. Adicionar testes E2E de fluxo offline → Cloud → AGT.

