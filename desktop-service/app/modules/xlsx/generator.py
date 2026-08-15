import os
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from app.schemas import GenerateReportRequest
from app.modules.common.logger import get_logger
from pathlib import Path

logger = get_logger(__name__)

class XLSXGenerator:
    def __init__(self):
        self.temp_dir = Path("temp")
        self.temp_dir.mkdir(exist_ok=True)

    async def generate_report(self, request: GenerateReportRequest) -> Path:
        """
        Generate an Excel report from the given request.
        """
        try:
            if request.reportType == "BILLING" and request.metadata and "billingData" in request.metadata:
                return await self._generate_billing_report(request)

            if request.reportType == "STOCK" and request.metadata and "stockData" in request.metadata:
                return await self._generate_stock_report(request)

            wb = Workbook()
            ws = wb.active
            ws.title = request.reportType

            # Styles
            header_font = Font(bold=True, color="FFFFFF")
            header_fill = PatternFill(start_color="4F81BD", end_color="4F81BD", fill_type="solid")
            center_alignment = Alignment(horizontal="center", vertical="center")
            thin_border = Border(
                left=Side(style='thin'), 
                right=Side(style='thin'), 
                top=Side(style='thin'), 
                bottom=Side(style='thin')
            )

            # Title
            ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(request.columns))
            ws.cell(row=1, column=1).value = request.title
            ws.cell(row=1, column=1).font = Font(size=14, bold=True)
            ws.cell(row=1, column=1).alignment = center_alignment

            # Company Name (optional)
            if request.companyName:
                ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=len(request.columns))
                ws.cell(row=2, column=1).value = request.companyName
                ws.cell(row=2, column=1).font = Font(size=12)
                ws.cell(row=2, column=1).alignment = center_alignment
                header_row = 4
            else:
                header_row = 3

            # Headers
            for col_idx, column_name in enumerate(request.columns, 1):
                cell = ws.cell(row=header_row, column=col_idx)
                cell.value = column_name
                cell.font = Font(bold=True, color="FFFFFF")
                cell.fill = header_fill
                cell.alignment = center_alignment
                cell.border = thin_border

            # Data
            for row_idx, row_data in enumerate(request.data, header_row + 1):
                for col_idx, cell_value in enumerate(row_data, 1):
                    cell = ws.cell(row=row_idx, column=col_idx)
                    cell.value = cell_value
                    cell.border = thin_border
                    
                    # Auto-width adjustment (basic)
                    column_letter = ws.cell(row=row_idx, column=col_idx).column_letter
                    current_width = ws.column_dimensions[column_letter].width or 10
                    new_width = max(current_width, len(str(cell_value)) + 2)
                    ws.column_dimensions[column_letter].width = min(new_width, 50)

            # Generate filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"report_{request.reportType.lower()}_{timestamp}.xlsx"
            filepath = self.temp_dir / filename

            wb.save(filepath)
            logger.info(f"Report generated: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating XLSX report: {str(e)}", exc_info=True)
            raise

    async def _generate_billing_report(self, request: GenerateReportRequest) -> Path:
        try:
            wb = Workbook()
            ws = wb.active
            ws.title = "Resumo"
            
            billing_data = request.metadata.get("billingData", {})
            company_data = billing_data.get("company", {})
            sections_data = billing_data.get("sections", {})

            # Styles
            title_font = Font(bold=True, size=12)
            bold_font = Font(bold=True)
            center_alignment = Alignment(horizontal="center", vertical="center")
            right_alignment = Alignment(horizontal="right")
            thin_border = Border(
                left=Side(style='thin'), 
                right=Side(style='thin'), 
                top=Side(style='thin'), 
                bottom=Side(style='thin')
            )
            number_format = '#,##0.00'

            # Header
            ws.cell(row=1, column=1, value=company_data.get("name", "Empresa")).font = Font(bold=True, size=14)
            ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=6)
            ws.cell(row=1, column=1).alignment = center_alignment

            ws.cell(row=2, column=1, value=f"NIF: {company_data.get('taxNumber', '')}")
            ws.cell(row=3, column=1, value=f"Endereço: {company_data.get('address', '')}")

            ws.cell(row=5, column=1, value="Resumo de Documentos Emitidos").font = bold_font
            ws.merge_cells(start_row=5, start_column=1, end_row=5, end_column=6)
            ws.cell(row=5, column=1).alignment = center_alignment

            ws.cell(row=7, column=1, value="Data Inicial:").font = bold_font
            ws.cell(row=7, column=2, value=billing_data.get("startDate", ""))
            ws.cell(row=8, column=1, value="Data Final:").font = bold_font
            ws.cell(row=8, column=2, value=billing_data.get("endDate", ""))

            current_row = 10

            def write_table(title, columns, data, totals_cols, current_row):
                ws.cell(row=current_row, column=1, value=title).font = bold_font
                ws.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=len(columns))
                ws.cell(row=current_row, column=1).alignment = center_alignment
                current_row += 1

                for col_idx, col_name in enumerate(columns, 1):
                    cell = ws.cell(row=current_row, column=col_idx, value=col_name)
                    cell.font = bold_font
                    cell.border = thin_border
                    cell.alignment = center_alignment
                current_row += 1

                totals = [0] * len(totals_cols)
                for item in data:
                    for col_idx, key in enumerate(columns, 1):
                        val = item.get(key, "")
                        cell = ws.cell(row=current_row, column=col_idx, value=val)
                        cell.border = thin_border
                        if col_idx - 1 in totals_cols:
                            cell.number_format = number_format
                            cell.alignment = right_alignment
                            totals[totals_cols.index(col_idx - 1)] += val if isinstance(val, (int, float)) else 0
                        else:
                            # Align first two columns (Data, Document) to center, Client to left
                            if col_idx <= 2:
                                cell.alignment = center_alignment
                            else:
                                cell.alignment = Alignment(horizontal="left")
                    current_row += 1

                # Subtotal row
                ws.cell(row=current_row, column=1, value="SUB-TOTAL").font = bold_font
                ws.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=totals_cols[0])
                ws.cell(row=current_row, column=1).alignment = right_alignment
                for i in range(1, totals_cols[0] + 1):
                    ws.cell(row=current_row, column=i).border = thin_border
                
                for idx, col_idx in enumerate(totals_cols):
                    cell = ws.cell(row=current_row, column=col_idx + 1, value=totals[idx])
                    cell.font = bold_font
                    cell.border = thin_border
                    cell.number_format = number_format
                    cell.alignment = right_alignment
                
                # Fill remaining borders if any
                for col_idx in range(totals_cols[-1] + 2, len(columns) + 1):
                    ws.cell(row=current_row, column=col_idx).border = thin_border
                    
                current_row += 3 # Extra space between tables
                return current_row, totals

            # 1. Facturas Emitidas
            ft_cols = {"date": "DATA", "document": "DOCUMENTO", "client": "CLIENTE", "subtotal": "S/IMPOSTOS", "total": "TOTAL"}
            ft_data = [{ft_cols[k]: v for k, v in item.items()} for item in sections_data.get("FT", [])]
            current_row, ft_totals = write_table("FACTURAS EMITIDAS (FT)", list(ft_cols.values()), ft_data, [3, 4], current_row)

            # 2. Facturas Recibo
            fr_data = [{ft_cols[k]: v for k, v in item.items()} for item in sections_data.get("FR", [])]
            current_row, fr_totals = write_table("FACTURAS RECIBO (FR)", list(ft_cols.values()), fr_data, [3, 4], current_row)

            # 3. Notas de Crédito
            nc_cols = {"date": "DATA", "document": "DOCUMENTO", "client": "CLIENTE", "subtotal": "VALOR S/IMPOSTOS", "total": "VALOR TOTAL"}
            nc_data = [{nc_cols[k]: v for k, v in item.items()} for item in sections_data.get("NC", [])]
            current_row, nc_totals = write_table("NOTAS DE CRÉDITO EMITIDAS", list(nc_cols.values()), nc_data, [3, 4], current_row)

            # 4. Recibos Emitidos
            rg_cols = {"date": "DATA", "document": "DOCUMENTO", "client": "CLIENTE", "toPay": "A PAGAR", "retention": "RETENÇÃO", "received": "RECEBIDO"}
            rg_data = [{rg_cols[k]: v for k, v in item.items()} for item in sections_data.get("RG", [])]
            current_row, rg_totals = write_table("RECIBOS EMITIDOS", list(rg_cols.values()), rg_data, [3, 4, 5], current_row)

            # 5. Resumo
            ws.cell(row=current_row, column=1, value="RESUMO POR TIPO DE DOCUMENTO").font = bold_font
            ws.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=3)
            ws.cell(row=current_row, column=1).alignment = center_alignment
            current_row += 1

            resumo_cols = ["DESCRIÇÃO", "S/IMPOSTOS", "TOTAL"]
            for col_idx, col_name in enumerate(resumo_cols, 1):
                cell = ws.cell(row=current_row, column=col_idx, value=col_name)
                cell.font = bold_font
                cell.border = thin_border
                cell.alignment = center_alignment
            current_row += 1

            summary_rows = [
                ("FACTURAS EMITIDAS (FT)", ft_totals[0], ft_totals[1]),
                ("FACTURAS RECIBO (FR)", fr_totals[0], fr_totals[1]),
                ("NOTAS DE CRÉDITO EMITIDAS", nc_totals[0], nc_totals[1]),
                ("RECIBOS EMITIDOS", rg_totals[0], rg_totals[2] if len(rg_totals) > 2 else 0),
            ]

            for desc, subt, tot in summary_rows:
                cell_d = ws.cell(row=current_row, column=1, value=desc)
                cell_d.border = thin_border
                cell_d.alignment = Alignment(horizontal="left")
                
                cell_s = ws.cell(row=current_row, column=2, value=subt)
                cell_s.border = thin_border
                cell_s.number_format = number_format
                cell_s.alignment = right_alignment
                
                cell_t = ws.cell(row=current_row, column=3, value=tot)
                cell_t.border = thin_border
                cell_t.number_format = number_format
                cell_t.alignment = right_alignment
                
                current_row += 1

            # Remove gridlines for a cleaner look
            ws.sheet_view.showGridLines = False

            # Auto-width
            for col_letter in ['A', 'B', 'C', 'D', 'E', 'F']:
                ws.column_dimensions[col_letter].width = 20
            ws.column_dimensions['A'].width = 16
            ws.column_dimensions['B'].width = 22
            ws.column_dimensions['C'].width = 35
            ws.column_dimensions['D'].width = 20
            ws.column_dimensions['E'].width = 20
            ws.column_dimensions['F'].width = 20

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"report_{request.reportType.lower()}_{timestamp}.xlsx"
            filepath = self.temp_dir / filename

            wb.save(filepath)
            logger.info(f"Billing report generated: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating Billing report: {str(e)}", exc_info=True)
            raise

    async def _generate_stock_report(self, request: GenerateReportRequest) -> Path:
        try:
            wb = Workbook()
            ws = wb.active
            ws.title = "Dashboard de Stock"
            ws.sheet_view.showGridLines = False
            
            stock_data = request.metadata.get("stockData", {})
            company_data = stock_data.get("company", {})
            summary = stock_data.get("summary", {})
            items = stock_data.get("items", [])
            categories = stock_data.get("categoryTotals", {})

            # Theme Colors (Purple palette)
            COLOR_MAIN = "8B5CF6"
            COLOR_LIGHT = "F5F3FF"
            COLOR_WHITE = "FFFFFF"

            fill_main = PatternFill(start_color=COLOR_MAIN, end_color=COLOR_MAIN, fill_type="solid")
            fill_light = PatternFill(start_color=COLOR_LIGHT, end_color=COLOR_LIGHT, fill_type="solid")
            fill_white = PatternFill(start_color=COLOR_WHITE, end_color=COLOR_WHITE, fill_type="solid")

            font_title = Font(color=COLOR_WHITE, bold=True, size=20)
            font_kpi_header = Font(color=COLOR_WHITE, bold=True, size=12)
            font_kpi_value = Font(color=COLOR_MAIN, bold=True, size=16)
            font_header = Font(color=COLOR_WHITE, bold=True, size=11)
            font_normal = Font(size=11)

            center_alignment = Alignment(horizontal="center", vertical="center")
            right_alignment = Alignment(horizontal="right", vertical="center")
            left_alignment = Alignment(horizontal="left", vertical="center")
            
            thin_border = Border(
                left=Side(style='thin', color="CCCCCC"), 
                right=Side(style='thin', color="CCCCCC"), 
                top=Side(style='thin', color="CCCCCC"), 
                bottom=Side(style='thin', color="CCCCCC")
            )

            # 1. Banner
            ws.merge_cells(start_row=1, start_column=1, end_row=2, end_column=6)
            banner_cell = ws.cell(row=1, column=1, value="RELATÓRIO DE STOCK")
            banner_cell.font = font_title
            banner_cell.fill = fill_main
            banner_cell.alignment = center_alignment

            # 2. Company Info
            ws.cell(row=4, column=1, value=f"Empresa: {company_data.get('name', '')}").font = Font(bold=True)
            ws.cell(row=5, column=1, value=f"NIF: {company_data.get('taxNumber', '')}")
            ws.cell(row=6, column=1, value=f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M')}")

            # 3. KPI Cards
            kpis = [
                ("Total de Produtos", summary.get("totalItemsCount", 0), 1, 2),
                ("Total em Stock (Qtd)", summary.get("totalStockQuantity", 0), 3, 4),
                ("Valor Total (Kz)", f"{summary.get('totalStockValue', 0):,.2f}".replace(",", "X").replace(".", ",").replace("X", "."), 5, 6),
            ]

            for title, value, start_col, end_col in kpis:
                # Header
                ws.merge_cells(start_row=4, start_column=start_col, end_row=4, end_column=end_col)
                h_cell = ws.cell(row=4, column=start_col, value=title)
                h_cell.font = font_kpi_header
                h_cell.fill = fill_main
                h_cell.alignment = center_alignment
                ws.cell(row=4, column=end_col).fill = fill_main

                # Value
                ws.merge_cells(start_row=5, start_column=start_col, end_row=7, end_column=end_col)
                v_cell = ws.cell(row=5, column=start_col, value=value)
                v_cell.font = font_kpi_value
                v_cell.fill = fill_light
                v_cell.alignment = center_alignment
                
                # Borders
                for r in range(4, 8):
                    for c in range(start_col, end_col + 1):
                        ws.cell(row=r, column=c).border = thin_border

            # 4. Table Headers
            current_row = 10
            columns = ["SKU", "NOME", "CATEGORIA", "STOCK ATUAL", "PREÇO VENDA", "VALOR TOTAL"]
            
            for col_idx, col_name in enumerate(columns, 1):
                cell = ws.cell(row=current_row, column=col_idx, value=col_name)
                cell.font = font_header
                cell.fill = fill_main
                cell.alignment = center_alignment
                cell.border = thin_border
            
            current_row += 1

            # 5. Table Data
            number_format = '#,##0.00'
            for idx, item in enumerate(items):
                is_even = idx % 2 == 0
                row_fill = fill_white if is_even else fill_light

                data_row = [
                    item.get("sku", ""),
                    item.get("name", ""),
                    item.get("category", ""),
                    item.get("currentStock", 0),
                    item.get("price", 0),
                    item.get("totalValue", 0)
                ]

                for col_idx, val in enumerate(data_row, 1):
                    cell = ws.cell(row=current_row, column=col_idx, value=val)
                    cell.fill = row_fill
                    cell.border = thin_border
                    cell.font = font_normal

                    if col_idx in [1, 3, 4]:  # SKU, Categoria, Stock
                        cell.alignment = center_alignment
                    elif col_idx in [5, 6]:  # Price, Total Value
                        cell.alignment = right_alignment
                        cell.number_format = number_format
                    else:
                        cell.alignment = left_alignment
                
                current_row += 1

            # 6. Chart Data (Hidden below table)
            chart_data_start = current_row + 5
            ws.cell(row=chart_data_start, column=1, value="Categoria")
            ws.cell(row=chart_data_start, column=2, value="Valor Total")
            
            cat_row = chart_data_start + 1
            for cat_name, totals in categories.items():
                ws.cell(row=cat_row, column=1, value=cat_name)
                ws.cell(row=cat_row, column=2, value=totals["value"])
                cat_row += 1

            # 7. Create Chart
            if categories:
                chart = BarChart()
                chart.type = "col"
                chart.style = 10
                chart.title = "Valor em Stock por Categoria"
                chart.y_axis.title = "Valor (Kz)"
                chart.x_axis.title = "Categoria"
                chart.legend = None

                data_ref = Reference(ws, min_col=2, min_row=chart_data_start, max_row=cat_row - 1)
                cats_ref = Reference(ws, min_col=1, min_row=chart_data_start + 1, max_row=cat_row - 1)
                
                chart.add_data(data_ref, titles_from_data=True)
                chart.set_categories(cats_ref)
                
                # Position chart to the right of the KPIs
                ws.add_chart(chart, "H4")

            # Column Widths
            ws.column_dimensions['A'].width = 15
            ws.column_dimensions['B'].width = 30
            ws.column_dimensions['C'].width = 20
            ws.column_dimensions['D'].width = 15
            ws.column_dimensions['E'].width = 18
            ws.column_dimensions['F'].width = 20

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"report_stock_{timestamp}.xlsx"
            filepath = self.temp_dir / filename

            wb.save(filepath)
            logger.info(f"Stock dashboard generated: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating Stock report: {str(e)}", exc_info=True)
            raise
