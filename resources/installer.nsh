!macro customHeader
  !define MUI_WELCOMEPAGE_TITLE "Bem-vindo ao Assistente de Instalação do Mindgest POS"
  !define MUI_WELCOMEPAGE_TEXT "Este assistente irá instalar o Mindgest POS no seu computador.$\r$\n$\r$\nO Mindgest POS é o sistema corporativo de faturação eletrónica e ponto de venda offline e online certificado pela AGT.$\r$\n$\r$\nO instalador irá verificar os requisitos de hardware para a Rede Local Multi-Terminal (Master/Slave).$\r$\n$\r$\nClique em Seguinte para continuar."
  !define MUI_FINISHPAGE_TITLE "Instalação do Mindgest POS Concluída"
  !define MUI_FINISHPAGE_TEXT "O Mindgest POS foi instalado e configurado com sucesso no seu computador.$\r$\n$\r$\nA porta de rede local (3333) foi habilitada na Firewall para a comunicação entre caixas.$\r$\n$\r$\nClique em Concluir para fechar este assistente."
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

  ; Configurar regra de Firewall do Windows para permitir porta 3333 (Rede Local Master)
  nsExec::Exec 'netsh advfirewall firewall add rule name="Mindgest POS Local Server" dir=in action=allow protocol=TCP localport=3333 enable=yes'
!macroend

!macro customUnInstall
  ; Remover regra de Firewall na desinstalação
  nsExec::Exec 'netsh advfirewall firewall delete rule name="Mindgest POS Local Server"'
!macroend
