!macro customHeader
  !define MUI_WELCOMEPAGE_TITLE "Bem-vindo ao Assistente de Instalação do Mindgest POS"
  !define MUI_WELCOMEPAGE_TEXT "Este assistente irá instalar o Mindgest POS no seu computador.$\r$\n$\r$\nO Mindgest POS é o sistema corporativo de faturação eletrónica e ponto de venda offline e online certificado pela AGT.$\r$\n$\r$\nO instalador irá configurar automaticamente as regras de Firewall do Windows para a Rede Local Multi-Terminal (TCP 3333, mDNS UDP 5353 e Broadcast UDP 3334).$\r$\n$\r$\nClique em Seguinte para continuar."
  !define MUI_FINISHPAGE_TITLE "Instalação do Mindgest POS Concluída"
  !define MUI_FINISHPAGE_TEXT "O Mindgest POS foi instalado e configurado com sucesso no seu computador.$\r$\n$\r$\nAs portas de rede local (TCP 3333, UDP 5353, UDP 3334) foram habilitadas na Firewall do Windows para comunicação imediata entre terminais de caixa.$\r$\n$\r$\nClique em Concluir para fechar este assistente."
  !define MUI_FINISHPAGE_RUN
  !define MUI_FINISHPAGE_RUN_TEXT "Executar o Mindgest POS agora"
!macroend

!macro customInit
  ; Verificar se é arquitetura 64-bit
  ${If} ${RunningX64}
    DetailPrint "Arquitetura 64-bit confirmada."
  ${Else}
    MessageBox MB_ICONEXCLAMATION "Aviso: O Mindgest POS é otimizado para sistemas operativos de 64-bit."
  ${EndIf}
!macroend

!macro customInstall
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "Publisher" "Mindware - Comércio & Serviços"
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "URLInfoAbout" "https://mindgest.mindware.ao"
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "HelpLink" "https://mindgest.mindware.ao/suporte"

  ; Configurar regras de Firewall do Windows (Inbound & Outbound, Perfis Privado e Público)
  nsExec::Exec 'netsh advfirewall firewall add rule name="Mindgest POS Local Server (TCP 3333)" dir=in action=allow protocol=TCP localport=3333 enable=yes profile=any'
  nsExec::Exec 'netsh advfirewall firewall add rule name="Mindgest POS mDNS Discovery (UDP 5353)" dir=in action=allow protocol=UDP localport=5353 enable=yes profile=any'
  nsExec::Exec 'netsh advfirewall firewall add rule name="Mindgest POS UDP Broadcast (UDP 3334)" dir=in action=allow protocol=UDP localport=3334 enable=yes profile=any'
!macroend

!macro customUnInstall
  ; Remover regras de Firewall na desinstalação
  nsExec::Exec 'netsh advfirewall firewall delete rule name="Mindgest POS Local Server (TCP 3333)"'
  nsExec::Exec 'netsh advfirewall firewall delete rule name="Mindgest POS mDNS Discovery (UDP 5353)"'
  nsExec::Exec 'netsh advfirewall firewall delete rule name="Mindgest POS UDP Broadcast (UDP 3334)"'
!macroend
