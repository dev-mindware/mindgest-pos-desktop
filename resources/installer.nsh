!macro customHeader
  !define MUI_WELCOMEPAGE_TITLE "Bem-vindo ao Assistente de Instalação do MindGest POS"
  !define MUI_WELCOMEPAGE_TEXT "Este assistente irá instalar o MindGest POS no seu computador.$\r$\n$\r$\nO MindGest POS é o sistema corporativo de faturação eletrónica e ponto de venda offline e online certificado.$\r$\n$\r$\nClique em Seguinte para continuar."
  !define MUI_FINISHPAGE_TITLE "Instalação do MindGest POS Concluída"
  !define MUI_FINISHPAGE_TEXT "O MindGest POS foi instalado com sucesso no seu computador.$\r$\n$\r$\nClique em Concluir para fechar este assistente."
  !define MUI_FINISHPAGE_RUN
  !define MUI_FINISHPAGE_RUN_TEXT "Executar o MindGest POS agora"
!macroend

!macro customInstall
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "Publisher" "Mindware - Comércio & Serviços"
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "URLInfoAbout" "https://mindgest.mindware.ao"
  WriteRegStr HKCU "Software\Mindware\MindGestPOS" "HelpLink" "https://mindgest.mindware.ao/suporte"
!macroend
