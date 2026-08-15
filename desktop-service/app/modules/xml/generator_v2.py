# Enhanced XML Generator with document-type specific handlers
from pathlib import Path
from xml.dom import minidom
from app.schemas import GenerateDocumentRequest, DocumentType
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.common.builders import DocumentBuilder, XMLBuilder
from app.modules.common.logger import get_logger

logger = get_logger(__name__)

class XMLGeneratorV2(BaseDocumentGenerator):
    """Enhanced XML generator with proper document-type handling."""
    
    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """Generate XML document based on document type."""
        try:
            logger.info(f"Generating XML for {request.documentType.value}: {request.invoiceNumber}")
            
            # Build document context
            context = DocumentBuilder.build_document_context(request)
            
            # Route to specific generator based on document type
            if request.documentType == DocumentType.INVOICE:
                xml_content = self._generate_invoice_xml(context)
            elif request.documentType == DocumentType.RECEIPT:
                xml_content = self._generate_receipt_xml(context)
            elif request.documentType == DocumentType.PROFORMA:
                xml_content = self._generate_proforma_xml(context)
            elif request.documentType == DocumentType.CREDIT_NOTE:
                xml_content = self._generate_credit_note_xml(context)
            else:
                xml_content = self._generate_generic_xml(context)
            
            # Save to file
            filename = f"{request.invoiceNumber}.xml"
            filepath = self.temp_dir / filename
            filepath.write_text(xml_content, encoding='utf-8')
            
            logger.info(f"XML generated successfully: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating XML: {str(e)}", exc_info=True)
            raise
    
    def _generate_invoice_xml(self, context: dict) -> str:
        """Generate invoice-specific XML."""
        structure = XMLBuilder.build_invoice_xml_structure(context)
        return self._build_xml_string(structure, context)
    
    def _generate_receipt_xml(self, context: dict) -> str:
        """Generate receipt-specific XML."""
        structure = XMLBuilder.build_receipt_xml_structure(context)
        return self._build_xml_string(structure, context)
    
    def _generate_proforma_xml(self, context: dict) -> str:
        """Generate proforma-specific XML."""
        structure = XMLBuilder.build_proforma_xml_structure(context)
        return self._build_xml_string(structure, context)
    
    def _generate_credit_note_xml(self, context: dict) -> str:
        """Generate credit note-specific XML."""
        structure = XMLBuilder.build_credit_note_xml_structure(context)
        return self._build_xml_string(structure, context)
    
    def _generate_generic_xml(self, context: dict) -> str:
        """Generate generic XML for unknown document types."""
        structure = {
            'root': 'Documento',
            'sections': context
        }
        return self._build_xml_string(structure, context)
    
    def _build_xml_string(self, structure: dict, context: dict) -> str:
        """Build XML string from structure."""
        from xml.etree.ElementTree import Element, SubElement, tostring
        from xml.dom.minidom import parseString
        
        root = Element(structure['root'])
        
        # Add sections
        for section_name, section_data in structure['sections'].items():
            section_elem = SubElement(root, section_name)
            self._add_dict_to_xml(section_elem, section_data)
        
        # Pretty print
        rough_string = tostring(root, encoding='unicode')
        reparsed = parseString(rough_string)
        return reparsed.toprettyxml(indent="  ")
    
    def _add_dict_to_xml(self, parent, data):
        """Recursively add dictionary data to XML element."""
        from xml.etree.ElementTree import SubElement
        
        if isinstance(data, dict):
            for key, value in data.items():
                child = SubElement(parent, key)
                self._add_dict_to_xml(child, value)
        elif isinstance(data, list):
            for index, item in enumerate(data):
                item_elem = SubElement(parent, 'Item')
                self._add_dict_to_xml(item_elem, item)
        else:
            parent.text = str(data) if data is not None else ''
