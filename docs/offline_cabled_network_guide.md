# Guia Técnico de Infraestrutura e Cablagem — Rede Offline Multi-Terminal
## Mindgest POS (Variante Rede Cabeada / Ethernet)

> **Público-alvo**: Técnicos de suporte de campo, instaladores de TI e gestores de infraestrutura de retalho.  
> **Objetivo**: Garantir uma rede local com latência ultra-baixa (<2ms), zero perda de pacotes e alta disponibilidade fiscal sem dependência de internet ou Wi-Fi.

---

## 1. Topologia Física: Estrela Centralizada

A arquitetura oficial do Mindgest POS em rede cabeada utiliza uma **topologia em estrela**. Todos os computadores ligam-se diretamente a portas de um switch central com cabos dedicados.

```
                    +-----------------------------+
                    |    ROUTER DE INTERNET       |
                    | (Opcional - apenas p/ nuvem)|
                    +--------------+--------------+
                                   | Uplink
                    +--------------v--------------+
                    |      SWITCH GIGABIT         | <--- [UPS / NOBREAK DEDICADO]
                    |     (8, 16 ou 24 portas)    |
                    +---+--------+--------+-------+
                        |        |        |
         +--------------+        |        +---------------+
         |                       |                        |
+--------v-------+       +-------v--------+       +-------v--------+
| MASTER FISCAL  |       | SLAVE - CAIXA 1|       | SLAVE - CAIXA 2|
| (IP Estático)  |       | (Terminal PDV) |       | (Terminal PDV) |
| Porto TCP 3333 |       +----------------+       +----------------+
+----------------+
```

---

## 2. Requisitos de Cabos e Conectividade

| Item | Especificação Recomendada | Justificação Técnica |
|---|---|---|
| **Categoria do Cabo** | **Cat6 U/UTP ou F/UTP** | Frequência de até 250MHz; garante 1 Gbps real com margem de atenuação superior ao Cat5e. |
| **Limite de Distância** | **Máximo 90m permanente** + 10m patch cords | O limite padrão IEEE 802.3 é 100m. Acima de 100m ocorre perda de pacotes e degradação de sinal. |
| **Padrão de Crimpagem** | **T-568B** (Ambos os lados) | Padronização universal em ambas as extremidades (evita conexões cross-over inadvertidas). |
| **Conectores** | RJ-45 com banho de ouro 50µ | Evita oxidação provocada pela humidade ou calor em balcões comerciais. |
| **Caminho dos Cabos** | Separado da rede elétrica (>20cm) | Evita indução de ruído eletromagnético por motores, ar condicionado e balcões frigoríficos. |

> **Etiquetagem Obrigatória**: Coloque fita adesiva ou anilha numerada em ambas as pontas de cada cabo (ex: `M-MASTER`, `C-CAIXA1`, `C-CAIXA2`). Em caso de falha de balcão, o suporte remoto consegue orientar a troca de porta sem ambiguidade.

---

## 3. Seleção e Configuração do Switch de Rede

### Cenário A: Lojas Pequenas e Médias (Até 8 Terminais) — *Altamente Recomendado*
* **Modelo**: Switch **Não-Gerido (Unmanaged)** Gigabit (ex: TP-Link SG108, D-Link DGS-108, Ubiquiti Lite 8).
* **Vantagem**: Por defeito, encaminha tráfego Multicast e Broadcast para todas as portas sem restrições. O mDNS (`_mindgest-pos._tcp.local`) funciona de forma imediata (Plug & Play) sem necessidade de configuração.
* **Custo**: Baixo, sem manutenção e sem firmware sujeito a desconfiguração acidental.

---

### Cenário B: Redes Corporativas com Switch Gerido (Managed Switch)
Muitos switches geridos (Cisco, Ubiquiti UniFi, MikroTik, HP Aruba) ativam **IGMP Snooping** por defeito para poupar largura de banda. No entanto, **se não houver um IGMP Querier ativo na rede, o switch bloqueia os anúncios multicast mDNS entre o Master e os Caixas** após cerca de 3 a 5 minutos.

#### Procedimento de Configuração Obrigatório:
1. **Opção 1 (Recomendada)**: Desative o *IGMP Snooping* globalmente ou especificamente na VLAN reservada ao POS.
2. **Opção 2**: Caso a infraestrutura exija IGMP Snooping ativo, **habilite o IGMP Querier** no switch na VLAN do POS, configurando a versão IGMPv2/v3 e tempo de query de 60 a 125 segundos.
3. **VLAN Dedicada**: Isole as portas dos terminais POS numa VLAN separada (ex: `VLAN 20 - POS`), impedindo que câmaras IP ou Wi-Fi de visitantes saturem a rede de faturação.

> O Mindgest POS inclui agora uma ferramenta de **Diagnóstico de Switch**. Se o teste indicar *"Bloqueio Multicast: IGMP Snooping ativo"*, o técnico sabe imediatamente que o cabo físico está perfeito e o problema é a ausência do IGMP Querier no switch.

---

## 4. Endereçamento IP: Reserva DHCP vs. IP Estático

Para garantir estabilidade contínua sem depender da velocidade do DHCP após falhas de energia:

1. **Computador Master**:
   - Recomenda-se configurar **IP Estático** ou **Reserva de MAC no DHCP** (ex: `192.168.1.100`, Máscara `255.255.255.0`).
   - O Master utiliza a porta TCP `3333` para a API fiscal HTTP e a porta UDP `3334` para anúncio de broadcast.
2. **Terminais Slave (Caixas)**:
   - Podem utilizar DHCP automático.
   - O POS guarda em armazenamento seguro o último IP conhecido do Master. Ao ligar o caixa, o sistema tenta reconexão direta por TCP em menos de 50ms antes de disparar varredura de rede.

---

## 5. Proteção Elétrica e Redundância de Hardware

1. **UPS / Nobreak no Switch**:
   - Um switch desenergizado desliga instantaneamente todos os caixas entre si, mesmo que os computadores tenham baterias (laptops) ou nobreaks individuais.
   - **Regra de ouro**: O switch de rede deve estar ligado ao mesmo nobreak protegido que alimenta o computador Master.
2. **Switch de Reserva em Loja**:
   - Recomenda-se manter um switch não-gerido de 8 portas sobressalente guardado na gaveta técnica. Em caso de queima por descarga atmosférica, a substituição demora menos de 3 minutos.

---

## 6. Procedimento de Teste de Instalação (Checklist de Campo)

- [ ] Cabo Ethernet devidamente crimpado (padrão T-568B) e testado com testador de cabo de rede RJ-45 (todos os 8 pinos acesos).
- [ ] Luzes Link/Act (LED verde/âmbar) acesas fixas na placa de rede do Master e do Caixa.
- [ ] No Terminal Caixa: Aceder a **Definições do POS ➔ Rede Local ➔ Diagnosticar Switch**.
  - Confirmação de latência `< 2ms`.
  - Confirmação de *"Cabo e descoberta mDNS operando perfeitamente"*.
- [ ] Simular desconexão do cabo Ethernet:
  - O painel do Master deve transitar o estado do terminal para `IDLE` aos 5s e `DISCONNECTED` aos 8s.
  - Ao reconectar o cabo, o terminal deve recuperar a comunicação em menos de 2 segundos sem reiniciar a aplicação.
